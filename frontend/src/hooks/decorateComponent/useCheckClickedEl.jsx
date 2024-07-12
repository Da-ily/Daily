import { useEffect, useState } from 'react';

const useCheckClickedEl = (
  editingDecorateComponent,
  dispatchDecorateComponents,
) => {
  const [clickedElementId, setClickedElementId] = useState(null);

  const setClickedElementIdIfNotDecorateComponent = (e) => {
    e.stopPropagation();
    const elementId = e.target.id;

    if (!elementId.includes('decorate-component')) {
      setClickedElementId(
        elementId !== ''
          ? elementId
          : `temporary-clicked-id-${new Date().toISOString()}`,
      );
    }
  };

  useEffect(() => {
    document.addEventListener(
      'click',
      setClickedElementIdIfNotDecorateComponent,
    );

    return () => {
      document.removeEventListener(
        'click',
        setClickedElementIdIfNotDecorateComponent,
      );
    };
  }, []);

  const isEditingCompleted =
    editingDecorateComponent?.typeContent &&
    Object.values(editingDecorateComponent?.typeContent).every((v) => {
      return v !== null;
    });

  useEffect(() => {
    if (clickedElementId !== editingDecorateComponent?.id) {
      if (!isEditingCompleted) {
        dispatchDecorateComponents({
          type: 'delete',
          id: editingDecorateComponent.id,
        });
      }
    }
  }, [clickedElementId]);

  return { isEditingCompleted, clickedElementId };
};

export default useCheckClickedEl;
