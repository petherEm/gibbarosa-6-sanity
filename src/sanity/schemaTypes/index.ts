import { type SchemaTypeDefinition } from 'sanity'

import {blockContentType} from './blockContentType'
import {categoryType} from './categoryType'
import {postType} from './postType'
import {authorType} from './authorType'
import { productType } from './productType'
import { salesType } from './salesType'
import { orderType } from './orderType'
import { collectionType } from './collectionType'
import { brandType } from './brandType'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [blockContentType, categoryType, postType, authorType, productType, salesType, orderType, collectionType, brandType],
}
