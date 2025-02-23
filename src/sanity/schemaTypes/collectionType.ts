import {TagIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

export const collectionType = defineType({
  name: 'collection',
  title: 'Collection',
  type: 'document',
  icon: TagIcon,
  fields: [
    defineField({
      name: 'EN_title',
      type: 'string',
    }),
    defineField({
      name: 'FR_title',
      type: 'string',
    }),
    defineField({
      name: 'PL_title',
      type: 'string',
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      options: {
        source: 'ENtitle',
      },
    }),
    defineField({
      name: 'image',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'description',
      type: 'text',
    }),
  ],
  preview: {
    select: {
      title: 'EN_title',
      subtitle: 'description',
      media: 'image',
    },
  },
})
