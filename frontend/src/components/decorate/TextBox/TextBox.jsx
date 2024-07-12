import { useEffect, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import * as S from './TextBox.styled';
import useDebounce from '../../../hooks/useDebounce';

const TextBox = (props) => {
  const { id, typeContent, dispatchDecorateComponents } = props;
  const [text, setText] = useState(null);
  const debouncedText = useDebounce(text, 100);
  const textRef = useRef(null);
  const [height, setHeight] = useState(typeContent?.current?.scrollHeight);
  const payload = useMemo(
    () => ({
      id,
      type: 'setTypeContent',
      newTypeContent: { text: debouncedText },
    }),
    [debouncedText],
  );

  useEffect(() => {
    dispatchDecorateComponents(payload);
  }, [debouncedText]);

  useEffect(() => {
    setHeight(textRef?.current.scrollHeight);
  }, [textRef?.current?.scrollHeight]);

  useEffect(() => {
    if (typeContent?.text?.length > 0) {
      setText(typeContent.text);
    }
  }, []);

  return (
    <S.TextArea
      id={id}
      ref={textRef}
      value={text}
      height={height}
      onChange={(e) => {
        setText(e.target.value === '' ? null : e.target.value);
      }}
    />
  );
};

TextBox.propTypes = {
  id: PropTypes.string,
  typeContent: PropTypes.string,
  dispatchDecorateComponents: PropTypes.func,
};

export default TextBox;
