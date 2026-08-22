"""
NEXORA Centralized Reason Code System
======================================
All semantic failure/routing reason codes are defined here.
All consumers MUST import from this module — do not scatter raw strings.
"""


class ReasonCode:
    """Canonical reason code constants for HITL routing and semantic state."""

    # Structural / Schema Failures
    MALFORMED_INPUT_DATA = "MALFORMED_INPUT_DATA"

    # Identity Resolution Failures
    UNRESOLVED_MANUFACTURER_IDENTITY = "UNRESOLVED_MANUFACTURER_IDENTITY"
    UNRESOLVED_BRAND_IDENTITY = "UNRESOLVED_BRAND_IDENTITY"

    # Content & Context Failures
    MISSING_DESCRIPTION = "MISSING_DESCRIPTION"
    INSUFFICIENT_PRODUCT_CONTEXT = "INSUFFICIENT_PRODUCT_CONTEXT"
    MISSING_REQUIRED_FIELD = "MISSING_REQUIRED_FIELD"

    # Source & Evidence Failures
    NO_TRUSTED_SOURCE = "NO_TRUSTED_SOURCE"
    SOURCE_CONFLICT = "SOURCE_CONFLICT"

    # Attribute & Validation Failures
    LOW_FIELD_CONFIDENCE = "LOW_FIELD_CONFIDENCE"
    UNSUPPORTED_ATTRIBUTE = "UNSUPPORTED_ATTRIBUTE"
    INVALID_LOV_VALUE = "INVALID_LOV_VALUE"


# Blocking reason codes that MUST prevent auto-approval regardless of
# numerical overall confidence score.
BLOCKING_REASON_CODES = frozenset({
    ReasonCode.MALFORMED_INPUT_DATA,
    ReasonCode.UNRESOLVED_MANUFACTURER_IDENTITY,
    ReasonCode.UNRESOLVED_BRAND_IDENTITY,
    ReasonCode.NO_TRUSTED_SOURCE,
    ReasonCode.SOURCE_CONFLICT,
    ReasonCode.UNSUPPORTED_ATTRIBUTE,
    ReasonCode.INVALID_LOV_VALUE,
    ReasonCode.MISSING_REQUIRED_FIELD,
})


# Human-readable descriptions for frontend/API display
REASON_DESCRIPTIONS = {
    ReasonCode.MALFORMED_INPUT_DATA:
        "Input record has structural or schema errors that prevent processing.",
    ReasonCode.UNRESOLVED_MANUFACTURER_IDENTITY:
        "Manufacturer identity could not be resolved from the supplied input or trusted evidence.",
    ReasonCode.UNRESOLVED_BRAND_IDENTITY:
        "Brand identity could not be confidently resolved from trusted evidence.",
    ReasonCode.MISSING_DESCRIPTION:
        "Product description is missing or empty.",
    ReasonCode.INSUFFICIENT_PRODUCT_CONTEXT:
        "Insufficient product context to perform meaningful enrichment.",
    ReasonCode.NO_TRUSTED_SOURCE:
        "No trusted source evidence found to support enrichment claims.",
    ReasonCode.SOURCE_CONFLICT:
        "Multiple trusted sources provide conflicting information.",
    ReasonCode.LOW_FIELD_CONFIDENCE:
        "One or more fields have confidence scores below acceptable thresholds.",
    ReasonCode.UNSUPPORTED_ATTRIBUTE:
        "An extracted attribute is not supported by the LOV dictionary.",
    ReasonCode.INVALID_LOV_VALUE:
        "An attribute value does not conform to the canonical LOV dictionary.",
    ReasonCode.MISSING_REQUIRED_FIELD:
        "A required field is missing from the product record.",
}


def has_blocking_reason(flagged_reasons: list) -> bool:
    """Returns True if any reason in the list is a blocking reason code."""
    for reason in flagged_reasons:
        # Check exact match first (most reason codes are exact strings)
        if reason in BLOCKING_REASON_CODES:
            return True
        # Also check if the reason starts with a blocking code
        # (handles legacy compound reasons like "LOW_MANUFACTURER_CONFIDENCE: ...")
        for blocking in BLOCKING_REASON_CODES:
            if reason.startswith(blocking):
                return True
    return False
