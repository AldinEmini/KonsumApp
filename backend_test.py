#!/usr/bin/env python3
"""
Comprehensive backend API test for Konsum Super Market
Tests all endpoints at https://offers-hub-12.preview.emergentagent.com/api
"""
import requests
import json
from typing import Optional

BASE_URL = "https://offers-hub-12.preview.emergentagent.com/api"
ADMIN_EMAIL = "aldin@konsum.mk"
ADMIN_PASSWORD = "Aldin2008"

class TestSession:
    def __init__(self):
        self.session = requests.Session()
        self.cookie = None
        self.created_offer_id = None
        self.created_location_id = None
        
    def print_result(self, test_name: str, passed: bool, details: str = ""):
        status = "✅ PASS" if passed else "❌ FAIL"
        print(f"{status}: {test_name}")
        if details:
            print(f"   Details: {details}")
        if not passed:
            print()
    
    def test_health_check(self):
        """Test GET /api/health"""
        print("\n=== 1. HEALTH CHECK ===")
        try:
            resp = requests.get(f"{BASE_URL}/health", timeout=10)
            data = resp.json()
            
            passed = (
                resp.status_code == 200 and
                data.get("status") == "ok" and
                data.get("service") == "konsum-api" and
                "time" in data
            )
            self.print_result(
                "Health check endpoint",
                passed,
                f"Status: {resp.status_code}, Response: {json.dumps(data)}"
            )
            return passed
        except Exception as e:
            self.print_result("Health check endpoint", False, f"Exception: {str(e)}")
            return False
    
    def test_auth_login_valid(self):
        """Test POST /api/auth/login with valid credentials"""
        print("\n=== 2. AUTHENTICATION FLOW ===")
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
                data["user"].get("email") == ADMIN_EMAIL and
                cookie is not None
            )
            
            if passed:
                self.cookie = cookie
            
            self.print_result(
                "Login with valid credentials",
                passed,
                f"Status: {resp.status_code}, Cookie set: {cookie is not None}, User: {data.get('user', {}).get('email')}"
            )
            return passed
        except Exception as e:
            self.print_result("Login with valid credentials", False, f"Exception: {str(e)}")
            return False
    
    def test_auth_me_with_cookie(self):
        """Test GET /api/auth/me with cookie"""
        try:
            resp = self.session.get(f"{BASE_URL}/auth/me", timeout=10)
            data = resp.json()
            
            passed = (
                resp.status_code == 200 and
                "user" in data and
                data["user"].get("email") == ADMIN_EMAIL
            )
            
            self.print_result(
                "GET /api/auth/me with cookie",
                passed,
                f"Status: {resp.status_code}, User: {data.get('user', {}).get('email')}"
            )
            return passed
        except Exception as e:
            self.print_result("GET /api/auth/me with cookie", False, f"Exception: {str(e)}")
            return False
    
    def test_auth_me_without_cookie(self):
        """Test GET /api/auth/me without cookie"""
        try:
            resp = requests.get(f"{BASE_URL}/auth/me", timeout=10)
            
            passed = resp.status_code == 401
            
            self.print_result(
                "GET /api/auth/me without cookie returns 401",
                passed,
                f"Status: {resp.status_code}"
            )
            return passed
        except Exception as e:
            self.print_result("GET /api/auth/me without cookie", False, f"Exception: {str(e)}")
            return False
    
    def test_auth_login_wrong_password(self):
        """Test POST /api/auth/login with wrong password"""
        try:
            resp = requests.post(
                f"{BASE_URL}/auth/login",
                json={"email": ADMIN_EMAIL, "password": "WrongPassword123"},
                timeout=10
            )
            data = resp.json()
            
            # Should return 401 with Albanian error message
            passed = (
                resp.status_code == 401 and
                "error" in data and
                "Kredencialet" in data["error"]  # Albanian error message
            )
            
            self.print_result(
                "Login with wrong password returns 401 with Albanian error",
                passed,
                f"Status: {resp.status_code}, Error: {data.get('error')}"
            )
            return passed
        except Exception as e:
            self.print_result("Login with wrong password", False, f"Exception: {str(e)}")
            return False
    
    def test_auth_login_missing_fields(self):
        """Test POST /api/auth/login with missing fields"""
        try:
            resp = requests.post(
                f"{BASE_URL}/auth/login",
                json={"email": ADMIN_EMAIL},  # Missing password
                timeout=10
            )
            
            passed = resp.status_code == 400
            
            self.print_result(
                "Login with missing fields returns 400",
                passed,
                f"Status: {resp.status_code}"
            )
            return passed
        except Exception as e:
            self.print_result("Login with missing fields", False, f"Exception: {str(e)}")
            return False
    
    def test_auth_logout(self):
        """Test POST /api/auth/logout"""
        try:
            resp = self.session.post(f"{BASE_URL}/auth/logout", timeout=10)
            data = resp.json()
            
            # Check if cookie is cleared
            cookie_after = self.session.cookies.get("konsum_session")
            
            passed = (
                resp.status_code == 200 and
                data.get("ok") == True
            )
            
            self.print_result(
                "Logout clears session",
                passed,
                f"Status: {resp.status_code}, Cookie cleared: {cookie_after is None or cookie_after == ''}"
            )
            return passed
        except Exception as e:
            self.print_result("Logout", False, f"Exception: {str(e)}")
            return False
    
    def test_auth_me_after_logout(self):
        """Test GET /api/auth/me after logout"""
        try:
            resp = self.session.get(f"{BASE_URL}/auth/me", timeout=10)
            
            passed = resp.status_code == 401
            
            self.print_result(
                "GET /api/auth/me after logout returns 401",
                passed,
                f"Status: {resp.status_code}"
            )
            return passed
        except Exception as e:
            self.print_result("GET /api/auth/me after logout", False, f"Exception: {str(e)}")
            return False
    
    def test_offers_get_public(self):
        """Test GET /api/offers (public, active only)"""
        print("\n=== 3. OFFERS CRUD ===")
        try:
            resp = requests.get(f"{BASE_URL}/offers", timeout=10)
            data = resp.json()
            
            offers = data.get("offers", [])
            passed = (
                resp.status_code == 200 and
                "offers" in data and
                len(offers) >= 12  # Should have at least 12 seeded offers
            )
            
            self.print_result(
                "GET /api/offers returns seeded offers",
                passed,
                f"Status: {resp.status_code}, Offers count: {len(offers)}"
            )
            return passed
        except Exception as e:
            self.print_result("GET /api/offers", False, f"Exception: {str(e)}")
            return False
    
    def test_offers_get_all(self):
        """Test GET /api/offers?active=false (all offers)"""
        try:
            resp = requests.get(f"{BASE_URL}/offers?active=false", timeout=10)
            data = resp.json()
            
            passed = resp.status_code == 200 and "offers" in data
            
            self.print_result(
                "GET /api/offers?active=false returns all offers",
                passed,
                f"Status: {resp.status_code}, Offers count: {len(data.get('offers', []))}"
            )
            return passed
        except Exception as e:
            self.print_result("GET /api/offers?active=false", False, f"Exception: {str(e)}")
            return False
    
    def test_offers_get_single(self):
        """Test GET /api/offers/{id}"""
        try:
            # First get list to get an ID
            resp = requests.get(f"{BASE_URL}/offers", timeout=10)
            offers = resp.json().get("offers", [])
            
            if not offers:
                self.print_result("GET /api/offers/{id}", False, "No offers available to test")
                return False
            
            offer_id = offers[0]["id"]
            resp = requests.get(f"{BASE_URL}/offers/{offer_id}", timeout=10)
            data = resp.json()
            
            passed = (
                resp.status_code == 200 and
                "offer" in data and
                data["offer"]["id"] == offer_id
            )
            
            self.print_result(
                "GET /api/offers/{id} returns single offer",
                passed,
                f"Status: {resp.status_code}, Offer ID: {offer_id}"
            )
            return passed
        except Exception as e:
            self.print_result("GET /api/offers/{id}", False, f"Exception: {str(e)}")
            return False
    
    def test_offers_get_nonexistent(self):
        """Test GET /api/offers/nonexistent"""
        try:
            resp = requests.get(f"{BASE_URL}/offers/nonexistent-id-12345", timeout=10)
            
            passed = resp.status_code == 404
            
            self.print_result(
                "GET /api/offers/nonexistent returns 404",
                passed,
                f"Status: {resp.status_code}"
            )
            return passed
        except Exception as e:
            self.print_result("GET /api/offers/nonexistent", False, f"Exception: {str(e)}")
            return False
    
    def test_offers_post_without_auth(self):
        """Test POST /api/offers without authentication"""
        try:
            resp = requests.post(
                f"{BASE_URL}/offers",
                json={"name": "Test Product", "newPrice": 99},
                timeout=10
            )
            
            passed = resp.status_code == 401
            
            self.print_result(
                "POST /api/offers without auth returns 401",
                passed,
                f"Status: {resp.status_code}"
            )
            return passed
        except Exception as e:
            self.print_result("POST /api/offers without auth", False, f"Exception: {str(e)}")
            return False
    
    def test_offers_post_with_auth(self):
        """Test POST /api/offers with authentication and auto badge calculation"""
        try:
            # Re-login to get fresh session
            self.session.post(
                f"{BASE_URL}/auth/login",
                json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD},
                timeout=10
            )
            
            resp = self.session.post(
                f"{BASE_URL}/offers",
                json={
                    "name": "Test Product Auto Badge",
                    "category": "pije",
                    "newPrice": 99,
                    "oldPrice": 150,
                    "unit": "copë",
                    "image": "https://example.com/test.jpg"
                },
                timeout=10
            )
            data = resp.json()
            
            # Badge should be auto-computed: (150-99)/150 = 51/150 = 0.34 = 34% → "-34%"
            expected_badge = "-34%"
            actual_badge = data.get("offer", {}).get("badge")
            
            passed = (
                resp.status_code == 200 and
                "offer" in data and
                actual_badge == expected_badge
            )
            
            if passed:
                self.created_offer_id = data["offer"]["id"]
            
            self.print_result(
                "POST /api/offers with auth creates offer with auto badge",
                passed,
                f"Status: {resp.status_code}, Badge: {actual_badge} (expected: {expected_badge})"
            )
            return passed
        except Exception as e:
            self.print_result("POST /api/offers with auth", False, f"Exception: {str(e)}")
            return False
    
    def test_offers_post_missing_fields(self):
        """Test POST /api/offers with missing required fields"""
        try:
            resp = self.session.post(
                f"{BASE_URL}/offers",
                json={"category": "pije"},  # Missing name and newPrice
                timeout=10
            )
            
            passed = resp.status_code == 400
            
            self.print_result(
                "POST /api/offers with missing fields returns 400",
                passed,
                f"Status: {resp.status_code}"
            )
            return passed
        except Exception as e:
            self.print_result("POST /api/offers missing fields", False, f"Exception: {str(e)}")
            return False
    
    def test_offers_put_with_auth(self):
        """Test PUT /api/offers/{id} with auth and badge recomputation"""
        try:
            if not self.created_offer_id:
                self.print_result("PUT /api/offers/{id}", False, "No offer ID available")
                return False
            
            # Update with new prices, badge should recompute
            resp = self.session.put(
                f"{BASE_URL}/offers/{self.created_offer_id}",
                json={"newPrice": 50, "oldPrice": 100},
                timeout=10
            )
            data = resp.json()
            
            # Badge should be: (100-50)/100 = 0.5 = 50% → "-50%"
            expected_badge = "-50%"
            actual_badge = data.get("offer", {}).get("badge")
            
            passed = (
                resp.status_code == 200 and
                actual_badge == expected_badge
            )
            
            self.print_result(
                "PUT /api/offers/{id} with auth updates and recomputes badge",
                passed,
                f"Status: {resp.status_code}, Badge: {actual_badge} (expected: {expected_badge})"
            )
            return passed
        except Exception as e:
            self.print_result("PUT /api/offers/{id}", False, f"Exception: {str(e)}")
            return False
    
    def test_offers_put_without_auth(self):
        """Test PUT /api/offers/{id} without auth"""
        try:
            if not self.created_offer_id:
                self.print_result("PUT /api/offers/{id} without auth", False, "No offer ID available")
                return False
            
            resp = requests.put(
                f"{BASE_URL}/offers/{self.created_offer_id}",
                json={"newPrice": 75},
                timeout=10
            )
            
            passed = resp.status_code == 401
            
            self.print_result(
                "PUT /api/offers/{id} without auth returns 401",
                passed,
                f"Status: {resp.status_code}"
            )
            return passed
        except Exception as e:
            self.print_result("PUT /api/offers/{id} without auth", False, f"Exception: {str(e)}")
            return False
    
    def test_offers_delete_without_auth(self):
        """Test DELETE /api/offers/{id} without auth"""
        try:
            if not self.created_offer_id:
                self.print_result("DELETE /api/offers/{id} without auth", False, "No offer ID available")
                return False
            
            resp = requests.delete(f"{BASE_URL}/offers/{self.created_offer_id}", timeout=10)
            
            passed = resp.status_code == 401
            
            self.print_result(
                "DELETE /api/offers/{id} without auth returns 401",
                passed,
                f"Status: {resp.status_code}"
            )
            return passed
        except Exception as e:
            self.print_result("DELETE /api/offers/{id} without auth", False, f"Exception: {str(e)}")
            return False
    
    def test_offers_delete_with_auth(self):
        """Test DELETE /api/offers/{id} with auth"""
        try:
            if not self.created_offer_id:
                self.print_result("DELETE /api/offers/{id} with auth", False, "No offer ID available")
                return False
            
            resp = self.session.delete(f"{BASE_URL}/offers/{self.created_offer_id}", timeout=10)
            data = resp.json()
            
            passed = resp.status_code == 200 and data.get("ok") == True
            
            self.print_result(
                "DELETE /api/offers/{id} with auth succeeds",
                passed,
                f"Status: {resp.status_code}"
            )
            return passed
        except Exception as e:
            self.print_result("DELETE /api/offers/{id} with auth", False, f"Exception: {str(e)}")
            return False
    
    def test_offers_get_deleted(self):
        """Test GET /api/offers/{id} after deletion"""
        try:
            if not self.created_offer_id:
                self.print_result("GET deleted offer", False, "No offer ID available")
                return False
            
            resp = requests.get(f"{BASE_URL}/offers/{self.created_offer_id}", timeout=10)
            
            passed = resp.status_code == 404
            
            self.print_result(
                "GET deleted offer returns 404",
                passed,
                f"Status: {resp.status_code}"
            )
            return passed
        except Exception as e:
            self.print_result("GET deleted offer", False, f"Exception: {str(e)}")
            return False
    
    def test_content_get_public(self):
        """Test GET /api/content (public)"""
        print("\n=== 4. CONTENT SINGLETON ===")
        try:
            resp = requests.get(f"{BASE_URL}/content", timeout=10)
            data = resp.json()
            
            passed = (
                resp.status_code == 200 and
                "content" in data and
                data["content"] is not None
            )
            
            self.print_result(
                "GET /api/content returns site content",
                passed,
                f"Status: {resp.status_code}, Has content: {data.get('content') is not None}"
            )
            return passed
        except Exception as e:
            self.print_result("GET /api/content", False, f"Exception: {str(e)}")
            return False
    
    def test_content_put_without_auth(self):
        """Test PUT /api/content without auth"""
        try:
            resp = requests.put(
                f"{BASE_URL}/content",
                json={"site": {"phone": "+389 99 999 999"}},
                timeout=10
            )
            
            passed = resp.status_code == 401
            
            self.print_result(
                "PUT /api/content without auth returns 401",
                passed,
                f"Status: {resp.status_code}"
            )
            return passed
        except Exception as e:
            self.print_result("PUT /api/content without auth", False, f"Exception: {str(e)}")
            return False
    
    def test_content_put_with_auth(self):
        """Test PUT /api/content with auth"""
        try:
            # Ensure we're logged in
            self.session.post(
                f"{BASE_URL}/auth/login",
                json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD},
                timeout=10
            )
            
            test_phone = "+389 70 TEST 123"
            resp = self.session.put(
                f"{BASE_URL}/content",
                json={"site": {"phone": test_phone}},
                timeout=10
            )
            data = resp.json()
            
            passed = (
                resp.status_code == 200 and
                "content" in data
            )
            
            # Verify the change persisted
            if passed:
                get_resp = requests.get(f"{BASE_URL}/content", timeout=10)
                get_data = get_resp.json()
                phone_updated = get_data.get("content", {}).get("site", {}).get("phone") == test_phone
                passed = passed and phone_updated
            
            self.print_result(
                "PUT /api/content with auth updates content",
                passed,
                f"Status: {resp.status_code}, Phone updated: {phone_updated if 'phone_updated' in locals() else 'N/A'}"
            )
            return passed
        except Exception as e:
            self.print_result("PUT /api/content with auth", False, f"Exception: {str(e)}")
            return False
    
    def test_locations_get_public(self):
        """Test GET /api/locations (public)"""
        print("\n=== 5. LOCATIONS CRUD ===")
        try:
            resp = requests.get(f"{BASE_URL}/locations", timeout=10)
            data = resp.json()
            
            locations = data.get("locations", [])
            passed = (
                resp.status_code == 200 and
                "locations" in data and
                len(locations) >= 4  # Should have at least 4 seeded locations
            )
            
            self.print_result(
                "GET /api/locations returns seeded locations",
                passed,
                f"Status: {resp.status_code}, Locations count: {len(locations)}"
            )
            return passed
        except Exception as e:
            self.print_result("GET /api/locations", False, f"Exception: {str(e)}")
            return False
    
    def test_locations_post_without_auth(self):
        """Test POST /api/locations without auth"""
        try:
            resp = requests.post(
                f"{BASE_URL}/locations",
                json={"name": "Test Location", "address": "Test St 1"},
                timeout=10
            )
            
            passed = resp.status_code == 401
            
            self.print_result(
                "POST /api/locations without auth returns 401",
                passed,
                f"Status: {resp.status_code}"
            )
            return passed
        except Exception as e:
            self.print_result("POST /api/locations without auth", False, f"Exception: {str(e)}")
            return False
    
    def test_locations_post_with_auth(self):
        """Test POST /api/locations with auth"""
        try:
            # Ensure we're logged in
            self.session.post(
                f"{BASE_URL}/auth/login",
                json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD},
                timeout=10
            )
            
            resp = self.session.post(
                f"{BASE_URL}/locations",
                json={
                    "name": "Konsum Test Location",
                    "address": "Test Street 123",
                    "phone": "+389 70 111 222",
                    "hours": "08:00-20:00"
                },
                timeout=10
            )
            data = resp.json()
            
            passed = (
                resp.status_code == 200 and
                "location" in data and
                data["location"]["name"] == "Konsum Test Location"
            )
            
            if passed:
                self.created_location_id = data["location"]["id"]
            
            self.print_result(
                "POST /api/locations with auth creates location",
                passed,
                f"Status: {resp.status_code}, Location ID: {self.created_location_id}"
            )
            return passed
        except Exception as e:
            self.print_result("POST /api/locations with auth", False, f"Exception: {str(e)}")
            return False
    
    def test_locations_put_with_auth(self):
        """Test PUT /api/locations/{id} with auth"""
        try:
            if not self.created_location_id:
                self.print_result("PUT /api/locations/{id}", False, "No location ID available")
                return False
            
            resp = self.session.put(
                f"{BASE_URL}/locations/{self.created_location_id}",
                json={"phone": "+389 70 999 888"},
                timeout=10
            )
            data = resp.json()
            
            passed = (
                resp.status_code == 200 and
                "location" in data and
                data["location"]["phone"] == "+389 70 999 888"
            )
            
            self.print_result(
                "PUT /api/locations/{id} with auth updates location",
                passed,
                f"Status: {resp.status_code}"
            )
            return passed
        except Exception as e:
            self.print_result("PUT /api/locations/{id}", False, f"Exception: {str(e)}")
            return False
    
    def test_locations_delete_with_auth(self):
        """Test DELETE /api/locations/{id} with auth"""
        try:
            if not self.created_location_id:
                self.print_result("DELETE /api/locations/{id}", False, "No location ID available")
                return False
            
            resp = self.session.delete(f"{BASE_URL}/locations/{self.created_location_id}", timeout=10)
            data = resp.json()
            
            passed = resp.status_code == 200 and data.get("ok") == True
            
            self.print_result(
                "DELETE /api/locations/{id} with auth succeeds",
                passed,
                f"Status: {resp.status_code}"
            )
            return passed
        except Exception as e:
            self.print_result("DELETE /api/locations/{id}", False, f"Exception: {str(e)}")
            return False
    
    def test_stats_without_auth(self):
        """Test GET /api/stats without auth"""
        print("\n=== 6. STATS ENDPOINT ===")
        try:
            resp = requests.get(f"{BASE_URL}/stats", timeout=10)
            
            passed = resp.status_code == 401
            
            self.print_result(
                "GET /api/stats without auth returns 401",
                passed,
                f"Status: {resp.status_code}"
            )
            return passed
        except Exception as e:
            self.print_result("GET /api/stats without auth", False, f"Exception: {str(e)}")
            return False
    
    def test_stats_with_auth(self):
        """Test GET /api/stats with auth"""
        try:
            # Ensure we're logged in
            self.session.post(
                f"{BASE_URL}/auth/login",
                json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD},
                timeout=10
            )
            
            resp = self.session.get(f"{BASE_URL}/stats", timeout=10)
            data = resp.json()
            
            stats = data.get("stats", {})
            passed = (
                resp.status_code == 200 and
                "stats" in data and
                "active_offers" in stats and
                "total_products" in stats and
                "total_locations" in stats and
                "weekly_visits" in stats and
                "conversion_rate" in stats
            )
            
            self.print_result(
                "GET /api/stats with auth returns dashboard stats",
                passed,
                f"Status: {resp.status_code}, Stats: {json.dumps(stats)}"
            )
            return passed
        except Exception as e:
            self.print_result("GET /api/stats with auth", False, f"Exception: {str(e)}")
            return False
    
    def run_all_tests(self):
        """Run all tests in sequence"""
        print("=" * 70)
        print("KONSUM SUPER MARKET BACKEND API TEST SUITE")
        print(f"Testing: {BASE_URL}")
        print("=" * 70)
        
        results = []
        
        # 1. Health Check
        results.append(("Health check", self.test_health_check()))
        
        # 2. Authentication Flow
        results.append(("Auth: Login valid", self.test_auth_login_valid()))
        results.append(("Auth: /me with cookie", self.test_auth_me_with_cookie()))
        results.append(("Auth: /me without cookie", self.test_auth_me_without_cookie()))
        results.append(("Auth: Login wrong password", self.test_auth_login_wrong_password()))
        results.append(("Auth: Login missing fields", self.test_auth_login_missing_fields()))
        results.append(("Auth: Logout", self.test_auth_logout()))
        results.append(("Auth: /me after logout", self.test_auth_me_after_logout()))
        
        # 3. Offers CRUD
        results.append(("Offers: GET public", self.test_offers_get_public()))
        results.append(("Offers: GET all", self.test_offers_get_all()))
        results.append(("Offers: GET single", self.test_offers_get_single()))
        results.append(("Offers: GET nonexistent", self.test_offers_get_nonexistent()))
        results.append(("Offers: POST without auth", self.test_offers_post_without_auth()))
        results.append(("Offers: POST with auth", self.test_offers_post_with_auth()))
        results.append(("Offers: POST missing fields", self.test_offers_post_missing_fields()))
        results.append(("Offers: PUT with auth", self.test_offers_put_with_auth()))
        results.append(("Offers: PUT without auth", self.test_offers_put_without_auth()))
        results.append(("Offers: DELETE without auth", self.test_offers_delete_without_auth()))
        results.append(("Offers: DELETE with auth", self.test_offers_delete_with_auth()))
        results.append(("Offers: GET deleted", self.test_offers_get_deleted()))
        
        # 4. Content
        results.append(("Content: GET public", self.test_content_get_public()))
        results.append(("Content: PUT without auth", self.test_content_put_without_auth()))
        results.append(("Content: PUT with auth", self.test_content_put_with_auth()))
        
        # 5. Locations
        results.append(("Locations: GET public", self.test_locations_get_public()))
        results.append(("Locations: POST without auth", self.test_locations_post_without_auth()))
        results.append(("Locations: POST with auth", self.test_locations_post_with_auth()))
        results.append(("Locations: PUT with auth", self.test_locations_put_with_auth()))
        results.append(("Locations: DELETE with auth", self.test_locations_delete_with_auth()))
        
        # 6. Stats
        results.append(("Stats: GET without auth", self.test_stats_without_auth()))
        results.append(("Stats: GET with auth", self.test_stats_with_auth()))
        
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
    tester = TestSession()
    success = tester.run_all_tests()
    exit(0 if success else 1)
