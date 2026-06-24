#!/usr/bin/env python3
"""
Backend smoke test for auto-translation feature
Tests the new translation functionality added to Konsum API
"""

import requests
import json
import sys

BASE_URL = "https://offers-hub-12.preview.emergentagent.com/api"
ADMIN_EMAIL = "aldin@konsum.mk"
ADMIN_PASSWORD = "Aldin2008"

session = requests.Session()
test_results = []

def log_test(name, passed, details=""):
    status = "✅ PASS" if passed else "❌ FAIL"
    test_results.append({"name": name, "passed": passed, "details": details})
    print(f"{status}: {name}")
    if details:
        print(f"   {details}")

def test_offers_have_translations():
    """Test 1: GET /api/offers should return offers with translations field"""
    try:
        resp = session.get(f"{BASE_URL}/offers")
        if resp.status_code != 200:
            log_test("GET /api/offers returns 200", False, f"Got {resp.status_code}")
            return False
        
        data = resp.json()
        offers = data.get("offers", [])
        
        if not offers:
            log_test("GET /api/offers has offers", False, "No offers found")
            return False
        
        # Check first offer for translations structure
        first_offer = offers[0]
        if "translations" not in first_offer:
            log_test("Offers have translations field", False, f"First offer missing translations: {first_offer.keys()}")
            return False
        
        translations = first_offer["translations"]
        required_langs = ["en", "sq", "mk"]
        missing_langs = [lang for lang in required_langs if lang not in translations]
        
        if missing_langs:
            log_test("Offers translations have en/sq/mk", False, f"Missing languages: {missing_langs}. Found: {list(translations.keys())}")
            return False
        
        # Check each language has name and unit
        for lang in required_langs:
            if "name" not in translations[lang] or "unit" not in translations[lang]:
                log_test(f"Offers translations[{lang}] has name and unit", False, f"Missing fields in {lang}: {translations[lang].keys()}")
                return False
        
        log_test("GET /api/offers returns offers with translations (en/sq/mk with name/unit)", True, 
                f"Sample: {first_offer['name']} → en:{translations['en']['name']}, sq:{translations['sq']['name']}, mk:{translations['mk']['name']}")
        return True
        
    except Exception as e:
        log_test("GET /api/offers with translations", False, f"Exception: {str(e)}")
        return False

def test_content_has_translations():
    """Test 2: GET /api/content should return hero_slides with translations"""
    try:
        resp = session.get(f"{BASE_URL}/content")
        if resp.status_code != 200:
            log_test("GET /api/content returns 200", False, f"Got {resp.status_code}")
            return False
        
        data = resp.json()
        content = data.get("content", {})
        hero_slides = content.get("hero_slides", [])
        
        if not hero_slides:
            log_test("GET /api/content has hero_slides", False, "No hero_slides found")
            return False
        
        # Check first slide for translations
        first_slide = hero_slides[0]
        if "translations" not in first_slide:
            log_test("Hero slides have translations field", False, f"First slide missing translations: {first_slide.keys()}")
            return False
        
        translations = first_slide["translations"]
        required_langs = ["en", "sq", "mk"]
        missing_langs = [lang for lang in required_langs if lang not in translations]
        
        if missing_langs:
            log_test("Hero slides translations have en/sq/mk", False, f"Missing languages: {missing_langs}")
            return False
        
        # Check each language has title, subtitle, cta, badge
        required_fields = ["title", "subtitle", "cta", "badge"]
        for lang in required_langs:
            missing_fields = [f for f in required_fields if f not in translations[lang]]
            if missing_fields:
                log_test(f"Hero slides translations[{lang}] has all fields", False, f"Missing in {lang}: {missing_fields}")
                return False
        
        log_test("GET /api/content returns hero_slides with translations (en/sq/mk with title/subtitle/cta/badge)", True,
                f"Sample title: en:{translations['en']['title']}, sq:{translations['sq']['title']}")
        return True
        
    except Exception as e:
        log_test("GET /api/content with translations", False, f"Exception: {str(e)}")
        return False

def test_login():
    """Test 3: Login as admin"""
    try:
        resp = session.post(f"{BASE_URL}/auth/login", json={
            "email": ADMIN_EMAIL,
            "password": ADMIN_PASSWORD
        })
        
        if resp.status_code != 200:
            log_test("Login as admin", False, f"Got {resp.status_code}: {resp.text}")
            return False
        
        # Check cookie is set
        if "konsum_session" not in session.cookies:
            log_test("Login sets konsum_session cookie", False, "Cookie not found")
            return False
        
        log_test("Login as aldin@konsum.mk", True, "Authenticated successfully")
        return True
        
    except Exception as e:
        log_test("Login as admin", False, f"Exception: {str(e)}")
        return False

def test_create_offer_with_auto_translation():
    """Test 4: POST /api/offers with source_lang should auto-translate"""
    try:
        offer_data = {
            "name": "Vaj Ulliri 1L",
            "category": "te-tjera",
            "newPrice": 399,
            "oldPrice": 599,
            "unit": "copë",
            "image": "https://example.com/x.jpg",
            "source_lang": "sq"
        }
        
        resp = session.post(f"{BASE_URL}/offers", json=offer_data)
        
        if resp.status_code != 200:
            log_test("POST /api/offers with source_lang", False, f"Got {resp.status_code}: {resp.text}")
            return None
        
        data = resp.json()
        offer = data.get("offer", {})
        offer_id = offer.get("id")
        
        if not offer_id:
            log_test("POST /api/offers returns offer with id", False, "No id in response")
            return None
        
        # Check translations exist
        if "translations" not in offer:
            log_test("POST /api/offers returns translations", False, "No translations field")
            return None
        
        translations = offer["translations"]
        required_langs = ["en", "sq", "mk"]
        missing_langs = [lang for lang in required_langs if lang not in translations]
        
        if missing_langs:
            log_test("Auto-translated offer has en/sq/mk", False, f"Missing: {missing_langs}")
            return None
        
        # Check Albanian (source) has original text
        if translations["sq"]["name"] != "Vaj Ulliri 1L":
            log_test("Source language (sq) has original text", False, f"Expected 'Vaj Ulliri 1L', got '{translations['sq']['name']}'")
            return None
        
        # Check English and Macedonian have different translations
        en_name = translations["en"]["name"]
        mk_name = translations["mk"]["name"]
        
        if en_name == "Vaj Ulliri 1L" or mk_name == "Vaj Ulliri 1L":
            log_test("Auto-translation generated different text", False, f"en:{en_name}, mk:{mk_name} - translations look like source")
            return None
        
        # Check for "Olive Oil" in English (expected translation)
        if "olive" not in en_name.lower() and "oil" not in en_name.lower():
            log_test("English translation looks correct", False, f"Expected 'Olive Oil' related, got '{en_name}'")
            # Don't fail the test, just warn
            print(f"   ⚠️  Warning: English translation '{en_name}' doesn't contain 'olive' or 'oil'")
        
        log_test("POST /api/offers with source_lang:sq auto-translates", True,
                f"Created offer {offer_id} with translations: en:'{en_name}', sq:'{translations['sq']['name']}', mk:'{mk_name}'")
        return offer_id
        
    except Exception as e:
        log_test("POST /api/offers with auto-translation", False, f"Exception: {str(e)}")
        return None

def test_delete_offer(offer_id):
    """Test 5: DELETE the test offer"""
    if not offer_id:
        log_test("DELETE test offer", False, "No offer_id provided")
        return False
    
    try:
        resp = session.delete(f"{BASE_URL}/offers/{offer_id}")
        
        if resp.status_code != 200:
            log_test("DELETE test offer", False, f"Got {resp.status_code}: {resp.text}")
            return False
        
        # Verify it's deleted
        verify_resp = session.get(f"{BASE_URL}/offers/{offer_id}")
        if verify_resp.status_code != 404:
            log_test("Verify offer deleted", False, f"Offer still exists: {verify_resp.status_code}")
            return False
        
        log_test("DELETE test offer (cleanup)", True, f"Offer {offer_id} deleted successfully")
        return True
        
    except Exception as e:
        log_test("DELETE test offer", False, f"Exception: {str(e)}")
        return False

def test_translate_all():
    """Test 6: POST /api/translate-all should backfill translations"""
    try:
        resp = session.post(f"{BASE_URL}/translate-all")
        
        if resp.status_code != 200:
            log_test("POST /api/translate-all", False, f"Got {resp.status_code}: {resp.text}")
            return False
        
        data = resp.json()
        
        if not data.get("ok"):
            log_test("POST /api/translate-all returns ok:true", False, f"Got: {data}")
            return False
        
        translated_offers = data.get("translatedOffers", 0)
        translated_slides = data.get("translatedSlides", 0)
        
        if translated_offers <= 0:
            log_test("POST /api/translate-all translates offers", False, f"translatedOffers={translated_offers}, expected > 0")
            return False
        
        if translated_slides <= 0:
            log_test("POST /api/translate-all translates slides", False, f"translatedSlides={translated_slides}, expected > 0")
            return False
        
        log_test("POST /api/translate-all backfills translations", True,
                f"Translated {translated_offers} offers and {translated_slides} hero slides")
        return True
        
    except Exception as e:
        log_test("POST /api/translate-all", False, f"Exception: {str(e)}")
        return False

def main():
    print("=" * 80)
    print("KONSUM API AUTO-TRANSLATION SMOKE TEST")
    print("=" * 80)
    print()
    
    # Test 1: Check existing offers have translations
    print("Test 1: Verify existing offers have translations...")
    test_offers_have_translations()
    print()
    
    # Test 2: Check content has translations
    print("Test 2: Verify content hero_slides have translations...")
    test_content_has_translations()
    print()
    
    # Test 3: Login
    print("Test 3: Login as admin...")
    if not test_login():
        print("❌ Cannot continue without authentication")
        sys.exit(1)
    print()
    
    # Test 4: Create offer with auto-translation
    print("Test 4: Create offer with auto-translation (source_lang:sq)...")
    offer_id = test_create_offer_with_auto_translation()
    print()
    
    # Test 5: Delete test offer
    print("Test 5: Delete test offer (cleanup)...")
    test_delete_offer(offer_id)
    print()
    
    # Test 6: Translate-all endpoint
    print("Test 6: Test /api/translate-all endpoint...")
    test_translate_all()
    print()
    
    # Summary
    print("=" * 80)
    print("TEST SUMMARY")
    print("=" * 80)
    passed = sum(1 for t in test_results if t["passed"])
    total = len(test_results)
    print(f"Passed: {passed}/{total}")
    print()
    
    if passed == total:
        print("✅ ALL TESTS PASSED - Auto-translation feature working correctly!")
        sys.exit(0)
    else:
        print("❌ SOME TESTS FAILED")
        for t in test_results:
            if not t["passed"]:
                print(f"  - {t['name']}: {t['details']}")
        sys.exit(1)

if __name__ == "__main__":
    main()
