import PropTypes from 'prop-types';

import { DECORATE_COMPONENT } from '../../constants/decorateComponent';

const TypedDecorateComponent = (props) => {
  const { id, type, canEdit, typeContent, dispatchDecorateComponents } = props;
  const Com = DECORATE_COMPONENT[type];

  return (
    <Com
      id={id}
      canEdit={canEdit}
      typeContent={typeContent}
      dispatchDecorateComponents={dispatchDecorateComponents}
    />
  );
};

export default TypedDecorateComponent;

TypedDecorateComponent.propTypes = {
  id: PropTypes.string,
  decorateComponent: PropTypes.node,
  type: PropTypes.string,
  canEdit: PropTypes.bool,
  typeContent: PropTypes.object,
  dispatchDecorateComponents: PropTypes.func,
};
