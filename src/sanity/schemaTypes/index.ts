import { type SchemaTypeDefinition } from 'sanity';

import { blockContentType } from './blockContentType';
import { projectType } from './projectType';
import { articleType } from './articleType ';

export const schema: { types: SchemaTypeDefinition[] } = {
    types: [blockContentType, projectType, articleType],
};
