import React from 'react'
import { Form, Message } from 'semantic-ui-react'

const FormError = (errorMessage) => (
  <Form error>
    <Message
      error
      header={errorMessage.message}
      // header={errorMessage.response?.data}
      content={errorMessage.message?(<pre>{JSON.stringify(errorMessage.response?.data,null, 2)}</pre>):("")}
    />
  </Form>
)

export default FormError