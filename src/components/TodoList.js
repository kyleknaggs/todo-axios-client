import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import Todo from './Todo';

const FlexContainer = styled.div`
  align-items: center;
  display: flex;
  justify-content: center;
  margin:auto;
  max-width: 1200px;
`;

const TodoList= ({todos}) => {
  return (
    <FlexContainer>
      {todos.map(function(todo){
        return (
          <Todo
            key={todo.id}
            text={todo.text}
          />
        );
      })}
    </FlexContainer>
  );
};

TodoList.propTypes = {
  todos: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
    text: PropTypes.string.isRequired
  })).isRequired
}

export default TodoList;
