import { useState } from 'react';
import { typedDecorateComponentProperties } from './properties';
import { getCommonDecorateComponentProperties } from './createNewDecorateComponent';

const useNewDecorateComponent = (
  decorateComponents,
  dispatchDecorateComponents,
) => {
  const [newDecorateComponent, setNewDecorateComponent] = useState(null);

  const removeNewDecorateComponent = () => {
    setNewDecorateComponent(null);
  };

  const createNewDecorateComponent = (position, type) => {
    setNewDecorateComponent({
      ...getCommonDecorateComponentProperties(position),
      ...typedDecorateComponentProperties[type],
      type,
      order: decorateComponents.length,
    });
  };

  const setNewDecorateComponentTypeContent = (newTypeContent) => {
    setNewDecorateComponent((prev) => ({
      ...prev,
      typeContent: newTypeContent,
    }));
  };

  const isCreationCompleted =
    newDecorateComponent?.typeContent &&
    Object.values(newDecorateComponent?.typeContent).every((v) => v !== null);

  const completeCreateNewDecorateComponent = () => {
    if (isCreationCompleted) {
      dispatchDecorateComponents({
        type: 'addNew',
        newDecorateComponent,
        isUpdated: true,
      });
    }
    removeNewDecorateComponent();
  };

  return {
    createNewDecorateComponent,
    newDecorateComponent,
    setNewDecorateComponentTypeContent,
    completeCreateNewDecorateComponent,
  };
};

export default useNewDecorateComponent;
