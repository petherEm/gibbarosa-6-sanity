import {TagIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

export const conditionType = defineType({
  name: 'condition',
  title: 'Condition',
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
    },
    prepare(selection) {
      const {title, subtitle} = selection
      return {
        title: title || 'Untitled',
        subtitle: subtitle || '',
      }
    },
  },
})
