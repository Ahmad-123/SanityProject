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
    // {
    //   name: 'isGuitar',
    //   title: 'Add guitar info',
    //   type: 'boolean',
    //   initialValue: false,
    // },
    {

      title: 'Is Active (Custom Input)',
      name: 'activeStatus',
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
      title: 'Number of classes this quarter (Custom Input)',
      name: 'inputtext',
      description: 'Computed  by number of classes on the schedule',
      type: 'string',
      inputComponent: ComputedField,
      options: {
        editable: true,
        // This is the query to be sent
        documentQuerySelection: `
        "numScheduled": count(*[_type == "scheduledCourse" && references(^._id)])`,
        reduceQueryResult: (queryResult) => {
          console.log("Reached Number of classes this quarter custome input=>", queryResult.numScheduled)

          return queryResult.numScheduledl
        },
      },
    },
    {
      name: 'numberInputCustomInput', //Give your sanity field a name
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
          console.log("Reached number custome input=>", resultOfQuery.numberOfReferences)
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
