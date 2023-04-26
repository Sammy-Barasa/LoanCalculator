import React from 'react'
import { Form, Message } from 'semantic-ui-react'

const FormError = (errorMessage) => (
  <Form error>
    <Message
      error
      // header={errorMessage.message}
      header={errorMessage.response?.data}
      content={errorMessage.response?.data}
    />
  </Form>
)

export default FormError