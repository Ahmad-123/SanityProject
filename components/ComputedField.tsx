import * as React from 'react'
import { withDocument } from 'part:@sanity/form-builder'
import {
  TextInput,
  Button,
  Box,
  Flex,
  Stack,
  ThemeProvider,
  studioTheme,
  Switch,
  TextArea,
  Spinner,
} from '@sanity/ui'

import {
  Marker,
  Path,
  isValidationErrorMarker,
  SanityDocument,
} from '@sanity/types'
import DefaultFormField from 'part:@sanity/components/formfields/default'
// import styles from './ComputedField.css'
import PatchEvent, { set, unset } from 'part:@sanity/form-builder/patch-event'

import client from 'part:@sanity/base/client'
type SanityType = {
  _type?: string
  title: string
  description?: string
  name: string
  options: {
    buttonText?: string
    editable?: boolean
    documentQuerySelection: string
    reduceQueryResult: (queryResult: {
      [s: string]: any
    }) => number | string | null
    [s: string]: any
  }
}

export type SanityProps = {
  type: SanityType
  document: SanityDocument
  presence?: string
  readOnly?: boolean
  markers: Marker[]
  value?: unknown
  level?: number
  onFocus: (pathOrEvent?: Path | React.FocusEvent<any>) => void
  onChange: (ev: any) => void
}

const validateConfiguration = (options: SanityType['options']) => {
  const help =
    'https://github.com/wildseansy/sanity-plugin-computed-field#readme'
  if (!options) {
    throw new Error(`ComputedField: options required. See ${help}`)
  } else {
    let breakingKey = null
    if (!options.documentQuerySelection) {
      breakingKey = 'documentQuerySelection'
    } else if (!options.reduceQueryResult) {
      breakingKey = 'reduceQueryResult'
    }
    if (breakingKey) {
      throw new Error(
        `ComputedField: options.${breakingKey} is required. Please follow ${help}`
      )
    }
  }
}

const ComputedField: React.FC<SanityProps> = React.forwardRef(
  (props: SanityProps, forwardedRef: React.ForwardedRef<HTMLInputElement>) => {
    const { type, level, onFocus, value, markers } = props
    const document = props.document
    const errors = React.useMemo(
      () => markers.filter(isValidationErrorMarker),
      [markers]
    )

    const [loading, setLoading] = React.useState(false)
    const { _id, _type }: SanityDocument = document
    const options = props.type.options
    validateConfiguration(options)
    const reducer = React.useCallback(
      (queryResult: { [s: string]: unknown }) =>
        options.reduceQueryResult(queryResult),
      [options.reduceQueryResult]
    )
    const handleChange = React.useCallback(
      (val: any) => {
        // console.log(
        //   'Change input is called (call generate function): value is',
        //   val
        // )

        let validated = val
        if (type.name === 'number') {
          validated = parseFloat(val)
          if (validated === NaN) {
            validated = undefined
          }
        }
        // catering boolean values
        if (type.name == 'boolean') {
          // console.log("Switch Checkbox input value is ", typeof (val))
          // console.log("Switch Checkbox input value is ", val)
        }
        props.onChange(PatchEvent.from(validated ? set(validated) : unset()))
        // generate()
      },
      [props.onChange, type.name]
    )
    const onChange = React.useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => handleChange(e.target.value),
      [handleChange]
    )
    const generate = React.useCallback(() => {
      console.log('Generate Method is called')
      const query = `*[_type == '${_type}' && _id == '${_id}' || _id == '${_id.replace(
        'drafts.',
        ''
      )}'] {
        _id,
        ${options.documentQuerySelection}
       }`
      console.log('Generate Method: setloading')

      setLoading(true)
      client.fetch(query).then((items: SanityDocument[]) => {
        let record = items.find(({ _id }) => _id.includes('drafts'))
        if (!record) {
          // No draft, use the original:
          record = items[0]
        }
        const newValue = reducer(record)
        console.log('Generate Method: new Value is  ', newValue)
        console.log('Generate Method: Value is  ', value)

        if (newValue !== value) {
          let validated = newValue

          console.log('Generate Method: If condition true for ', newValue)

          if (type.name === 'number') {
            console.log('Generate Method: First If condition true')

            // validated = parseFloat(value)
            validated = value
            if (validated === NaN) {
              validated = undefined
            }
          }
          // catering boolean values
          if (type.name == 'boolean') {
            console.log('Generate Method: Second If condition true')
          }
          console.log('Generate Method: No condition true')

          props.onChange(PatchEvent.from(validated ? set(validated) : unset()))
        }
        setLoading(false)
      })
    }, [reducer, value, _id, _type])
    let TextComponent = type.name === 'text' ? TextArea : TextInput

    React.useEffect(() => {
      console.log(
        'Use effect is  called: I run everytime this component rerenders'
      )
      // generate()
      console.log('Generate Method is called')
      const query = `*[_type == '${_type}' && _id == '${_id}' || _id == '${_id.replace(
        'drafts.',
        ''
      )}'] {
        _id,
        ${options.documentQuerySelection}
       }`
      // console.log('Generate Method: setloading')

      setLoading(true)
      client.fetch(query).then((items: SanityDocument[]) => {
        let record = items.find(({ _id }) => _id.includes('drafts'))
        if (!record) {
          // No draft, use the original:
          record = items[0]
        }
        const newValue = reducer(record)
        console.log('Generate Method: new Value is  ', newValue)
        console.log('Generate Method: Value is  ', value)

        if (newValue !== value) {
          let validated = newValue

          console.log('Generate Method: If condition true for ', newValue)

          if (type.name === 'number') {
            console.log('input type is number')

            // validated = parseFloat(value)
            validated = newValue

            if (validated === NaN) {
              validated = undefined
            }
          }
          // catering boolean values
          if (type.name == 'boolean') {
            console.log('input type is boolean', newValue)
          }
          if (type.name == 'string') {
            console.log('input type is string')
            validated = String(newValue)
          }
          console.log('input type is text')

          props.onChange(PatchEvent.from(validated ? set(validated) : unset()))
        }
        setLoading(false)
      })
      console.log('Use effect ends')
    }, [])

    return (
      <ThemeProvider theme={studioTheme}>
        <Stack space={1}>
          <DefaultFormField
            label={type.title || type.name}
            level={level}
            description={type.description}
            presence={props.presence}
            markers={props.markers}
          >
            {type.name === 'boolean' ? (
              // <Switch
              //     checked={value}
              //     // value={checkedStatus}
              //     disabled={!options.editable}
              //     ref={forwardedRef}
              //     onChange={options.editable ? onChange : null}
              // />
              <Switch onChange={options.editable ? generate : null} />
            ) : (
              <TextComponent
                disabled={!options.editable}
                type={type.name === 'number' ? 'number' : 'text'}
                customValidity={errors.length > 0 ? errors[0].item.message : ''}
                ref={forwardedRef}
                onChange={options.editable ? onChange : null}
                value={value || ''}
                // onBlur={options.editable ? generate : null}
              />
            )}
          </DefaultFormField>
          {/* <Flex align="center">
                        <Button
                            mode="ghost"
                            type="button"
                            onClick={generate}
                            onFocus={onFocus}
                            text={options.buttonText || 'Regenerate'}
                        />
                        {loading && (
                            <Box paddingLeft={2}>
                                <Spinner muted />
                            </Box>
                        )}
                    </Flex> */}
        </Stack>
      </ThemeProvider>
    )
  }
)

export default withDocument(ComputedField)
