import {TagIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

export const collectionType = defineType({
  name: 'collection',
  title: 'Collection',
  type: 'document',
  icon: TagIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'object',
      fields: [
        defineField({
          name: 'PL',
          title: 'PL',
          type: 'string',
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: 'FR',
          title: 'FR',
          type: 'string',
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: 'EN',
          title: 'EN',
          type: 'string',
          validation: (Rule) => Rule.required(),
        }),
      ],
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title.EN',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'object',
      fields: [
        defineField({
          name: 'PL',
          title: 'PL',
          type: 'text',
        }),
        defineField({
          name: 'FR',
          title: 'FR',
          type: 'text',
        }),
        defineField({
          name: 'EN',
          title: 'EN',
          type: 'text',
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: 'title.EN',
      subtitle: 'description.EN',
      media: 'image',
    },
    prepare(selection) {
      const {title, subtitle, media} = selection
      return {
        title: title || 'Untitled Collection',
        subtitle: subtitle || '',
        media,
      }
    },
  },
})
