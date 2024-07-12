import { useRef } from 'react';
import PropTypes from 'prop-types';
import useDrawUtils from './useDrawUtils';
import useDrawInstance from './useDrawInstance';

const Drawing = (props) => {
  const canvas = useRef(null);
  const { canEdit, typeContent, dispatchDecorateComponent } = props;
  const { drawInstance } = useDrawInstance(canvas, typeContent);
  const { mouseEventHandlers, startMoving, stopMoving, mode } = useDrawUtils(
    canvas,
    drawInstance,
  );

  return (
    <>
      <canvas
        onMouseDown={(e) => {
          if (!canEdit) return;
          startMoving(e, mouseEventHandlers[mode]);
        }}
        onMouseUp={() => {
          if (!canEdit) return;
          stopMoving(mouseEventHandlers[mode]);
          dispatchDecorateComponent({
            type: 'setTypeContent',
            typeContent: { base64: drawInstance.getInfo() },
          });
        }}
        ref={canvas}
      ></canvas>

      {/** 툴바 에서 사용 가능한 코드들 */}
      {/*
        <Button onClick={() => saveCanvas()}>저장</Button>
        <Button onClick={() => setMode('drawMode')}>그리기</Button>
        <Button onClick={() => setMode('eraseMode')}>지우기</Button>
        <input
          type="color"
          onChange={(e) => drawInstance.setColor(e.target.value)}
        />
        <input
          type="range"
          onChange={(e) => drawInstance.setSize(e.target.value)}
        />
      */}
    </>
  );
};

Drawing.propTypes = {
  id: PropTypes.string,
  canEdit: PropTypes.bool,
  typeContent: PropTypes.object,
  dispatchDecorateComponent: PropTypes.func,
};

export default Drawing;
