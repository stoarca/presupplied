import React from 'react';

type ChoiceType = number | string;

interface ChoiceSelectorProps<T extends ChoiceType> {
  question?: string,
  choices: T[],
  choiceWidth?: number,
  howManyPerRow: number,
  getFill: (choice: T) => string,
  onSelected: (choice: T) => void,
}

export let ChoiceSelector = <T extends ChoiceType>(
  props: React.PropsWithChildren<ChoiceSelectorProps<T>>
) => {
  let handleClick = React.useCallback((e: React.MouseEvent) => {
    console.log('GOT A CLICK');
    if (e.button !== 0) {
      return;
    }
    let index = parseInt(e.currentTarget.getAttribute('data-choice-index')!);
    console.log('doing onselected');
    return props.onSelected(props.choices[index]);
  }, [props.choices, props.onSelected]);

  let question;
  if (props.question) {
    let qStyle: React.CSSProperties = {
      fontSize: '40px',
    }
    question = (
      <div style={qStyle}>
        {props.question}
      </div>
    );
  } else {
    question = null;
  }

  let choiceContainerStyle: React.CSSProperties = {
    border: '5px solid black',
    borderRadius: '10px',
    display: 'inline-block',
    alignItems: 'center',
    position: 'relative',
    fontSize: '80px',
    margin: '20px',
    padding: '20px',
    width: props.choiceWidth ? props.choiceWidth + 'px' : undefined,
  };
  let choices = [];
  for (let i = 0; i < props.choices.length; ++i) {
    choices.push(
      <div key={i}
          data-choice-index={i}
          style={choiceContainerStyle}
          onClick={handleClick}>
        {props.choices[i]}
      </div>
    );
  }

  let containerStyle = {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
  };
  let innerStyle: React.CSSProperties = {
    fontFamily: 'sans-serif',
    textAlign: 'center',
    width: '100%',
  };
  return (
    <div style={containerStyle}>
      <div style={innerStyle}>
        {question}
        <div>
          {choices}
        </div>
      </div>
    </div>
  );
};
