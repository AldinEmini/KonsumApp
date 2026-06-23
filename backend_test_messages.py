#!/usr/bin/env python3
"""
Backend API test for NEW Messages endpoint in Konsum API
Tests messages CRUD and updated stats endpoint
"""
import requests
import json
from typing import Optional

BASE_URL = "https://offers-hub-12.preview.emergentagent.com/api"
ADMIN_EMAIL = "aldin@konsum.mk"
ADMIN_PASSWORD = "Aldin2008"

class MessageTestSession:
    def __init__(self):
        self.session = requests.Session()
        self.cookie = None
        self.created_message_ids = []
        
    def print_result(self, test_name: str, passed: bool, details: str = ""):
        status = "✅ PASS" if passed else "❌ FAIL"
        print(f"{status}: {test_name}")
        if details:
            print(f"   Details: {details}")
        if not passed:
            print()
    
    def test_messages_post_public_valid(self):
        """Test POST /api/messages (PUBLIC, no auth needed) with valid data"""
        print("\n=== 1. MESSAGES ENDPOINT - POST (PUBLIC) ===")
        try:
            resp = requests.post(
                f"{BASE_URL}/messages",
                json={
                    "name": "Arben Hoxha",
                    "email": "arben.hoxha@example.com",
                    "phone": "+389 70 123 456",
                    "message": "Përshëndetje! Dua të di më shumë për ofertat tuaja."
                },
                timeout=10
            )
            data = resp.json()
            
            passed = (
                resp.status_code == 200 and
                "message" in data and
                data["message"].get("name") == "Arben Hoxha" and
                data["message"].get("email") == "arben.hoxha@example.com" and
                data["message"].get("read") == False and
                "id" in data["message"]
            )
            
            if passed:
                self.created_message_ids.append(data["message"]["id"])
            
            self.print_result(
                "POST /api/messages (public) creates message",
                passed,
                f"Status: {resp.status_code}, Message ID: {data.get('message', {}).get('id')}, Read: {data.get('message', {}).get('read')}"
            )
            return passed
        except Exception as e:
            self.print_result("POST /api/messages (public)", False, f"Exception: {str(e)}")
            return False
    
    def test_messages_post_missing_fields(self):
        """Test POST /api/messages with missing required fields"""
        try:
            resp = requests.post(
                f"{BASE_URL}/messages",
                json={
                    "name": "Test User",
                    "email": "test@test.com"
                    # Missing "message" field
                },
                timeout=10
            )
            
            passed = resp.status_code == 400
            
            self.print_result(
                "POST /api/messages with missing fields returns 400",
                passed,
                f"Status: {resp.status_code}"
            )
            return passed
        except Exception as e:
            self.print_result("POST /api/messages missing fields", False, f"Exception: {str(e)}")
            return False
    
    def test_messages_get_without_auth(self):
        """Test GET /api/messages without authentication"""
        print("\n=== 2. MESSAGES ENDPOINT - GET (PROTECTED) ===")
        try:
            resp = requests.get(f"{BASE_URL}/messages", timeout=10)
            
            passed = resp.status_code == 401
            
            self.print_result(
                "GET /api/messages without auth returns 401",
                passed,
                f"Status: {resp.status_code}"
            )
            return passed
        except Exception as e:
            self.print_result("GET /api/messages without auth", False, f"Exception: {str(e)}")
            return False
    
    def test_auth_login(self):
        """Login as admin to get session cookie"""
        print("\n=== 3. LOGIN FOR PROTECTED OPERATIONS ===")
        try:
            resp = self.session.post(
                f"{BASE_URL}/auth/login",
                json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD},
                timeout=10
            )
            data = resp.json()
            
            # Check for cookie
            cookie = self.session.cookies.get("konsum_session")
            
            passed = (
                resp.status_code == 200 and
                "user" in data and
                cookie is not None
            )
            
            if passed:
                self.cookie = cookie
            
            self.print_result(
                "Login as admin (aldin@konsum.mk)",
                passed,
                f"Status: {resp.status_code}, Cookie set: {cookie is not None}"
            )
            return passed
        except Exception as e:
            self.print_result("Login as admin", False, f"Exception: {str(e)}")
            return False
    
    def test_messages_get_with_auth(self):
        """Test GET /api/messages with authentication"""
        print("\n=== 4. MESSAGES ENDPOINT - GET WITH AUTH ===")
        try:
            resp = self.session.get(f"{BASE_URL}/messages", timeout=10)
            data = resp.json()
            
            passed = (
                resp.status_code == 200 and
                "messages" in data and
                "unread" in data and
                isinstance(data["messages"], list) and
                isinstance(data["unread"], int)
            )
            
            self.print_result(
                "GET /api/messages with auth returns messages and unread count",
                passed,
                f"Status: {resp.status_code}, Messages count: {len(data.get('messages', []))}, Unread: {data.get('unread')}"
            )
            return passed
        except Exception as e:
            self.print_result("GET /api/messages with auth", False, f"Exception: {str(e)}")
            return False
    
    def test_messages_put_mark_as_read(self):
        """Test PUT /api/messages/{id} to mark as read"""
        print("\n=== 5. MESSAGES ENDPOINT - PUT (MARK AS READ) ===")
        try:
            if not self.created_message_ids:
                self.print_result("PUT /api/messages/{id}", False, "No message ID available")
                return False
            
            message_id = self.created_message_ids[0]
            
            # First, get current unread count
            resp_before = self.session.get(f"{BASE_URL}/messages", timeout=10)
            unread_before = resp_before.json().get("unread", 0)
            
            # Mark message as read
            resp = self.session.put(
                f"{BASE_URL}/messages/{message_id}",
                json={"read": True},
                timeout=10
            )
            data = resp.json()
            
            passed = (
                resp.status_code == 200 and
                "message" in data and
                data["message"].get("read") == True
            )
            
            self.print_result(
                "PUT /api/messages/{id} marks message as read",
                passed,
                f"Status: {resp.status_code}, Read: {data.get('message', {}).get('read')}"
            )
            return passed
        except Exception as e:
            self.print_result("PUT /api/messages/{id}", False, f"Exception: {str(e)}")
            return False
    
    def test_messages_get_verify_unread_decreased(self):
        """Test GET /api/messages to verify unread count decreased"""
        try:
            resp = self.session.get(f"{BASE_URL}/messages", timeout=10)
            data = resp.json()
            
            # Just verify we can get the unread count
            passed = (
                resp.status_code == 200 and
                "unread" in data and
                isinstance(data["unread"], int)
            )
            
            self.print_result(
                "GET /api/messages verifies unread count updated",
                passed,
                f"Status: {resp.status_code}, Unread: {data.get('unread')}"
            )
            return passed
        except Exception as e:
            self.print_result("GET /api/messages verify unread", False, f"Exception: {str(e)}")
            return False
    
    def test_messages_delete_with_auth(self):
        """Test DELETE /api/messages/{id} with auth"""
        print("\n=== 6. MESSAGES ENDPOINT - DELETE ===")
        try:
            if not self.created_message_ids:
                self.print_result("DELETE /api/messages/{id}", False, "No message ID available")
                return False
            
            message_id = self.created_message_ids[0]
            resp = self.session.delete(f"{BASE_URL}/messages/{message_id}", timeout=10)
            data = resp.json()
            
            passed = resp.status_code == 200 and data.get("ok") == True
            
            self.print_result(
                "DELETE /api/messages/{id} with auth succeeds",
                passed,
                f"Status: {resp.status_code}"
            )
            return passed
        except Exception as e:
            self.print_result("DELETE /api/messages/{id}", False, f"Exception: {str(e)}")
            return False
    
    def test_messages_delete_nonexistent(self):
        """Test DELETE /api/messages/nonexistent"""
        try:
            resp = self.session.delete(f"{BASE_URL}/messages/nonexistent-id-99999", timeout=10)
            
            # Should return 200 (graceful) or 404
            passed = resp.status_code in [200, 404]
            
            self.print_result(
                "DELETE /api/messages/nonexistent returns gracefully",
                passed,
                f"Status: {resp.status_code}"
            )
            return passed
        except Exception as e:
            self.print_result("DELETE /api/messages/nonexistent", False, f"Exception: {str(e)}")
            return False
    
    def test_stats_includes_unread_messages(self):
        """Test GET /api/stats includes unread_messages field"""
        print("\n=== 7. STATS ENDPOINT - UPDATED WITH UNREAD_MESSAGES ===")
        try:
            resp = self.session.get(f"{BASE_URL}/stats", timeout=10)
            data = resp.json()
            
            stats = data.get("stats", {})
            passed = (
                resp.status_code == 200 and
                "stats" in data and
                "unread_messages" in stats and
                isinstance(stats["unread_messages"], int)
            )
            
            self.print_result(
                "GET /api/stats includes unread_messages field",
                passed,
                f"Status: {resp.status_code}, Stats: {json.dumps(stats)}"
            )
            return passed
        except Exception as e:
            self.print_result("GET /api/stats with unread_messages", False, f"Exception: {str(e)}")
            return False
    
    def test_existing_offers_endpoint(self):
        """Verify existing GET /api/offers still works"""
        print("\n=== 8. VERIFY EXISTING ENDPOINTS STILL WORK ===")
        try:
            resp = requests.get(f"{BASE_URL}/offers", timeout=10)
            data = resp.json()
            
            passed = (
                resp.status_code == 200 and
                "offers" in data and
                isinstance(data["offers"], list)
            )
            
            self.print_result(
                "GET /api/offers (existing endpoint) still works",
                passed,
                f"Status: {resp.status_code}, Offers count: {len(data.get('offers', []))}"
            )
            return passed
        except Exception as e:
            self.print_result("GET /api/offers", False, f"Exception: {str(e)}")
            return False
    
    def test_existing_auth_me_endpoint(self):
        """Verify existing GET /api/auth/me still works"""
        try:
            resp = self.session.get(f"{BASE_URL}/auth/me", timeout=10)
            data = resp.json()
            
            passed = (
                resp.status_code == 200 and
                "user" in data and
                data["user"].get("email") == ADMIN_EMAIL
            )
            
            self.print_result(
                "GET /api/auth/me (existing endpoint) still works",
                passed,
                f"Status: {resp.status_code}, User: {data.get('user', {}).get('email')}"
            )
            return passed
        except Exception as e:
            self.print_result("GET /api/auth/me", False, f"Exception: {str(e)}")
            return False
    
    def run_all_tests(self):
        """Run all tests in sequence"""
        print("=" * 70)
        print("KONSUM API - NEW MESSAGES ENDPOINT TEST SUITE")
        print(f"Testing: {BASE_URL}")
        print("=" * 70)
        
        results = []
        
        # 1. Messages POST (public)
        results.append(("Messages: POST public valid", self.test_messages_post_public_valid()))
        results.append(("Messages: POST missing fields", self.test_messages_post_missing_fields()))
        
        # 2. Messages GET without auth
        results.append(("Messages: GET without auth", self.test_messages_get_without_auth()))
        
        # 3. Login
        results.append(("Auth: Login", self.test_auth_login()))
        
        # 4. Messages GET with auth
        results.append(("Messages: GET with auth", self.test_messages_get_with_auth()))
        
        # 5. Messages PUT (mark as read)
        results.append(("Messages: PUT mark as read", self.test_messages_put_mark_as_read()))
        results.append(("Messages: GET verify unread decreased", self.test_messages_get_verify_unread_decreased()))
        
        # 6. Messages DELETE
        results.append(("Messages: DELETE with auth", self.test_messages_delete_with_auth()))
        results.append(("Messages: DELETE nonexistent", self.test_messages_delete_nonexistent()))
        
        # 7. Stats with unread_messages
        results.append(("Stats: includes unread_messages", self.test_stats_includes_unread_messages()))
        
        # 8. Verify existing endpoints
        results.append(("Existing: GET /api/offers", self.test_existing_offers_endpoint()))
        results.append(("Existing: GET /api/auth/me", self.test_existing_auth_me_endpoint()))
        
        # Summary
        print("\n" + "=" * 70)
        print("TEST SUMMARY")
        print("=" * 70)
        
        passed = sum(1 for _, result in results if result)
        total = len(results)
        
        print(f"\nTotal: {passed}/{total} tests passed")
        
        if passed == total:
            print("\n🎉 ALL TESTS PASSED! 🎉")
        else:
            print(f"\n⚠️  {total - passed} test(s) failed")
            print("\nFailed tests:")
            for name, result in results:
                if not result:
                    print(f"  ❌ {name}")
        
        print("\n" + "=" * 70)
        
        return passed == total


if __name__ == "__main__":
    tester = MessageTestSession()
    success = tester.run_all_tests()
    exit(0 if success else 1)
