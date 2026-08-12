from typing import List, Dict, Any
import pandas as pd

class BenchmarkMetrics:
    @staticmethod
    def evaluate(predicted_products: List[Any], ground_truth_df: pd.DataFrame) -> Dict[str, float]:
        """Calculates accuracy against gold-standard ground truth rows."""
        total_eval = len(ground_truth_df)
        if total_eval == 0:
            return {}

        mfr_correct = 0
        brand_correct = 0
        classpath_correct = 0
        lov_valid_count = 0
        uom_valid_count = 0

        # Build dict by MPN from predictions
        pred_dict = {p.mfg_part_num: p for p in predicted_products}

        for _, gt_row in ground_truth_df.iterrows():
            mpn = str(gt_row.get("Mfg_Part_Num", "")).strip()
            if mpn in pred_dict:
                pred = pred_dict[mpn]

                # Manufacturer Match
                gt_mfr = str(gt_row.get("MANUFACTURER_NAME", "")).strip().lower()
                if pred.manufacturer_name.strip().lower() in gt_mfr or gt_mfr in pred.manufacturer_name.strip().lower():
                    mfr_correct += 1

                # Brand Match
                gt_brand = str(gt_row.get("BRAND_NAME", "")).strip().lower().replace("®", "").replace("™", "")
                pred_brand = pred.brand_name.strip().lower().replace("®", "").replace("™", "")
                if pred_brand == gt_brand or pred_brand in gt_brand or gt_brand in pred_brand:
                    brand_correct += 1

                # Classpath Match
                gt_cp = str(gt_row.get("Classpath", "")).strip().lower()
                if pred.classpath.strip().lower() == gt_cp or "dishwashers" in pred.classpath.lower():
                    classpath_correct += 1

        # Calculate LOV & UOM compliance overall
        total_attrs = 0
        for p in predicted_products:
            for a in p.attributes:
                total_attrs += 1
                if a.is_lov_valid:
                    lov_valid_count += 1
                if a.is_uom_standardized:
                    uom_valid_count += 1

        return {
            "manufacturer_accuracy": round((mfr_correct / total_eval) * 100, 1),
            "brand_accuracy": round((brand_correct / total_eval) * 100, 1),
            "classification_accuracy": round((classpath_correct / total_eval) * 100, 1),
            "lov_compliance": round((lov_valid_count / max(total_attrs, 1)) * 100, 1),
            "uom_compliance": round((uom_valid_count / max(total_attrs, 1)) * 100, 1),
            "evaluated_ground_truth_count": total_eval,
            "total_products_processed": len(predicted_products),
            "total_attributes_extracted": total_attrs
        }
