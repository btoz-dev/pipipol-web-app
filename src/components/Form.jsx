import React from 'react';

const Form = props => (
  <form onSubmit={props.getPolling} style={{ marginBottom:"2rem" }}>
    <input className="form__input" type="text" name="pollingName" />
    <button className="form__button">Search</button>
  </form>
);

export default Form;