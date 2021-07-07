import BatchRowSoak from '../soak/batch_row_soak';
import { cryoMixin } from '../reusable_components/cryo_mixin.js';
import { basicCocktailMixin } from '../reusable_components/basic_cocktail_mixin.js';
import { cocktailBatchInfoMixin } from '../reusable_components/cocktail_batch_info_mixin.js'

class BatchRowCocktailCryo extends cocktailBatchInfoMixin(basicCocktailMixin(cryoMixin(BatchRowSoak))) {}

export default BatchRowCocktailCryo;