import React from 'react'
import { Form, Message } from 'semantic-ui-react'

const FormError = (errorMessage) => (
  <Form error>
    <Message
      error
      header={errorMessage.response?.statusText||errorMessage.message}
      content={errorMessage.response?.data||errorMessage.stack}
    />
  </Form>
)

export default FormError