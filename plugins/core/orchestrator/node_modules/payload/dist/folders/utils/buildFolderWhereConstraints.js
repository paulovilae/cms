import { combineWhereConstraints } from '../../utilities/combineWhereConstraints.js';
import { mergeListSearchAndWhere } from '../../utilities/mergeListSearchAndWhere.js';
export async function buildFolderWhereConstraints({ collectionConfig, folderID, localeCode, req, search = '', sort }) {
    const constraints = [
        mergeListSearchAndWhere({
            collectionConfig,
            search
        })
    ];
    if (typeof collectionConfig.admin?.baseListFilter === 'function') {
        const baseListFilterConstraint = await collectionConfig.admin.baseListFilter({
            limit: 0,
            locale: localeCode,
            page: 1,
            req,
            sort: sort || (typeof collectionConfig.defaultSort === 'string' ? collectionConfig.defaultSort : 'id')
        });
        if (baseListFilterConstraint) {
            constraints.push(baseListFilterConstraint);
        }
    }
    if (folderID) {
        // build folder join where constraints
        constraints.push({
            relationTo: {
                equals: collectionConfig.slug
            }
        });
    }
    const filteredConstraints = constraints.filter(Boolean);
    if (filteredConstraints.length > 1) {
        return combineWhereConstraints(filteredConstraints);
    } else if (filteredConstraints.length === 1) {
        return filteredConstraints[0];
    }
    return undefined;
}

//# sourceMappingURL=buildFolderWhereConstraints.js.map