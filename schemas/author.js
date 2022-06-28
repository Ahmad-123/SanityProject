import ComputedField from '../components/ComputedField'
// import ComputedField from 'sanity-plugin-computed-field'
export default {
  name: 'author',
  title: 'Author',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Name',
      type: 'string',
    },

    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 96,
      },
    },
    {
      name: 'isGuitar',
      title: 'Add guitar info',
      type: 'boolean',
      initialValue: false,
    },
    {
      // name: "computeInput", //Give your sanity field a name
      // type: "boolean", //"number" or "text" or "string" or "boolean"
      // inputComponent: ComputedField,
      // options: {
      //   editable: true,
      //   buttonText: "Regenerate",
      //   documentQuerySelection: `
      //     _id,
      //     "numberOfReferences": count(*[references(^._id)])
      //   `,
      //   reduceQueryResult: (resultOfQuery) => {
      //     return resultOfQuery.numberOfReferences
      //   }
      // },

      title: 'Is Active',
      name: 'activeStatus',
      description:
        'Whether this course has scheduled items remaining this quarter.',
      type: 'boolean',
      inputComponent: ComputedField,

      options: {
        editable: true,
        documentQuerySelection: `
        "numScheduled": count(*[_type == "scheduledCourse" && references(^._id) && startTime > ${new Date().toISOString()}])
        `,
        reduceQueryResult: (queryResult) => {
          return queryResult.numScheduled > 0
        },
      },
    },
    {
      title: 'Number of classes this quarter',
      name: 'inputtext',
      description: 'Computed by number of classes on the schedule',
      type: 'string',
      inputComponent: ComputedField,
      options: {
        editable: true,

        documentQuerySelection: `
        "numScheduled": count(*[_type == "scheduledCourse" && references(^._id)])`,
        reduceQueryResult: (queryResult) => {
          return queryResult.numScheduled
        },
      },
    },
    {
      name: 'numberInput', //Give your sanity field a name
      type: 'number', //"number" or "text" or "string" or "boolean"
      inputComponent: ComputedField,
      options: {
        editable: true,
        buttonText: 'Regenerate',
        documentQuerySelection: `
          _id,
          "numberOfReferences": count(*[references(^._id)])
        `,
        reduceQueryResult: (resultOfQuery) => {
          return resultOfQuery.numberOfReferences
        },
      },
    },
    // {
    //   name: "computeInput", //Give your sanity field a name
    //   type: "number", //"number" or "text" or "string" or "boolean"
    //   inputComponent: ComputedField,
    //   options: {
    //     editable: true,
    //     buttonText: "Regenerate",
    //     documentQuerySelection: `
    //       _id,
    //       "numberOfReferences": count(*[references(^._id)])
    //     `,
    //     reduceQueryResult: (resultOfQuery) => {
    //       return resultOfQuery.numberOfReferences
    //     }
    //   }

    // },
    {
      name: 'image',
      title: 'Image',
      type: 'image',
      options: {
        hotspot: true,
      },
    },
    {
      name: 'bio',
      title: 'Bio',
      type: 'array',
      of: [
        {
          title: 'Block',
          type: 'block',
          styles: [{ title: 'Normal', value: 'normal' }],
          lists: [],
        },
      ],
    },
  ],
  preview: {
    select: {
      title: 'name',
      media: 'image',
    },
  },
}