import re
from typing import Dict, List, Any, Optional, Tuple

class SourceTier:
    TIER_1_PDF_DATASHEET = 1    # Primary MFR PDF/Datasheet (1.0)
    TIER_2_MFR_WEBSITE = 2      # Official MFR Product Page (0.95)
    TIER_3_DISTRIBUTOR = 3      # Authorized Distributor (HomeDepot, Lowe's, Grainger) (0.85)
    TIER_4_GENERIC_WEB = 4      # Generic Web Snippet (0.70)
    EXCLUDED = 99               # Prohibited Marketplaces (Amazon, eBay)

PROHIBITED_MARKETPLACES = [
    "amazon.", "ebay.", "aliexpress.", "walmart.", "target.", "bestbuy.", "alibaba."
]

AUTHORIZED_DISTRIBUTORS = [
    "homedepot.com", "lowes.com", "grainger.com", "mcmaster.com", "zoro.com", "build.com"
]

class SourceTrustEngine:
    """Production 4-tier source hierarchy & conflict resolution engine."""

    @staticmethod
    def classify_source_tier(domain: str, content_type: str = "html", manufacturer: str = "") -> int:
        """Classifies a URL/domain into 4 source tiers or EXCLUDED."""
        if not domain:
            return SourceTier.TIER_4_GENERIC_WEB

        d_clean = domain.strip().lower()

        # 1. Check prohibited marketplaces
        if any(bad in d_clean for bad in PROHIBITED_MARKETPLACES):
            return SourceTier.EXCLUDED

        # 2. Check Tier 1: Manufacturer PDF / Datasheet
        if content_type == "pdf" and manufacturer and manufacturer.lower() in d_clean:
            return SourceTier.TIER_1_PDF_DATASHEET

        # 3. Check Tier 2: Official Manufacturer Site
        if manufacturer and manufacturer.lower() in d_clean:
            return SourceTier.TIER_2_MFR_WEBSITE

        # 4. Check Tier 3: Authorized Industrial Distributors
        if any(dist in d_clean for dist in AUTHORIZED_DISTRIBUTORS):
            return SourceTier.TIER_3_DISTRIBUTOR

        # 5. Default Tier 4: Generic Web
        return SourceTier.TIER_4_GENERIC_WEB

    @classmethod
    def resolve_attribute_conflict(
        cls,
        attr_name: str,
        val1: str,
        domain1: str,
        content_type1: str,
        val2: str,
        domain2: str,
        content_type2: str,
        manufacturer: str = ""
    ) -> Dict[str, Any]:
        """Resolves conflicting attribute values based on source hierarchy."""
        tier1 = cls.classify_source_tier(domain1, content_type1, manufacturer)
        tier2 = cls.classify_source_tier(domain2, content_type2, manufacturer)

        v1_clean = str(val1).strip().lower()
        v2_clean = str(val2).strip().lower()

        # If values match (exact or normalized), no conflict
        if v1_clean == v2_clean:
            return {
                "resolved_value": val1,
                "winner_domain": domain1,
                "conflict_detected": False,
                "resolution_reason": "MATCH"
            }

        # If one source is prohibited, pick non-prohibited
        if tier1 == SourceTier.EXCLUDED and tier2 != SourceTier.EXCLUDED:
            return {
                "resolved_value": val2,
                "winner_domain": domain2,
                "conflict_detected": False,
                "resolution_reason": "EXCLUDED_SOURCE_DISCARDED"
            }
        if tier2 == SourceTier.EXCLUDED and tier1 != SourceTier.EXCLUDED:
            return {
                "resolved_value": val1,
                "winner_domain": domain1,
                "conflict_detected": False,
                "resolution_reason": "EXCLUDED_SOURCE_DISCARDED"
            }

        # Higher tier (lower tier number) wins
        if tier1 < tier2:
            return {
                "resolved_value": val1,
                "winner_domain": domain1,
                "conflict_detected": False,
                "resolution_reason": f"TIER_{tier1}_OVERRIDE_TIER_{tier2}"
            }
        elif tier2 < tier1:
            return {
                "resolved_value": val2,
                "winner_domain": domain2,
                "conflict_detected": False,
                "resolution_reason": f"TIER_{tier2}_OVERRIDE_TIER_{tier1}"
            }

        # Equal tiers with conflicting values -> CONFLICT_DETECTED -> Route to HITL
        return {
            "resolved_value": val1,  # Propose primary
            "winner_domain": domain1,
            "conflict_detected": True,
            "route_to_hitl": True,
            "resolution_reason": f"SAME_TIER_CONFLICT (Tier {tier1}: '{val1}' vs '{val2}')"
        }
