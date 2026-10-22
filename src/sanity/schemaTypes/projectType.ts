import { DocumentTextIcon } from '@sanity/icons/DocumentText';
import { defineArrayMember, defineField, defineType } from 'sanity';

export const projectType = defineType({
    name: 'project',
    title: 'Project',
    type: 'document',
    icon: DocumentTextIcon,
    fields: [
        defineField({
            name: 'title',
            type: 'string',
        }),
        defineField({
            name: 'description',
            title: 'Description',
            type: 'string',
        }),
        defineField({
            name: 'slug',
            type: 'slug',
            options: {
                source: 'title',
            },
        }),
        defineField({
            name: 'links',
            title: 'Links',
            type: 'array',
            of: [
                defineArrayMember({
                    type: 'object',
                    name: 'websiteLink',
                    title: 'Website Link',
                    fields: [
                        defineField({
                            type: 'string',
                            name: 'url',
                            title: 'URL',
                        }),
                    ],
                }),
                defineArrayMember({
                    type: 'object',
                    name: 'repoLink',
                    title: 'Repository Link',
                    fields: [
                        defineField({
                            type: 'string',
                            name: 'url',
                            title: 'URL',
                        }),
                    ],
                }),
            ],
        }),
        defineField({
            name: 'tags',
            title: 'tags',
            type: 'array',
            of: [
                defineArrayMember({
                    type: 'string',
                    name: 'tag',
                    title: 'Tag',
                }),
            ],
        }),
        defineField({
            name: 'mainImage',
            type: 'image',
            options: {
                hotspot: true,
            },
            fields: [
                defineField({
                    name: 'alt',
                    type: 'string',
                    title: 'Alternative text',
                }),
            ],
        }),
        defineField({
            name: 'publishedAt',
            type: 'datetime',
        }),

        defineField({
            name: 'body',
            type: 'blockContent',
        }),
    ],
});
