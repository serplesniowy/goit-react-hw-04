import React from 'react';
import styles from './ErrorMessage.module.css';

const ErrorMessage = ({ message, status }) => (
  <div>
    {status && <p>Error Code: {status}</p>}
    <p>{message}</p>
  </div>
);

export default ErrorMessage;
