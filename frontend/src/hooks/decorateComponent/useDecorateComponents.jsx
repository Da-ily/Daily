import { useEffect, useReducer, useState } from 'react';
import { useDailryContext } from '../useDailryContext';
import { getPage } from '../../apis/dailryApi';
import { decorateComponentsReducer } from './decorateComponentsReducer';

const useDecorateComponents = () => {
  const { currentDailry, currentDailryPage } = useDailryContext();
  const { id } = currentDailry;
  const [decorateComponents, dispatchDecorateComponents] = useReducer(
    decorateComponentsReducer,
    [],
  );

  const [editingDecorateComponent, setEditingDecorateComponent] = useState('');

  useEffect(() => {
    const current = decorateComponents.find(
      (c) => c.editType === 'create' || c.editType === 'setTypeContent',
    );
    if (current) {
      setEditingDecorateComponent(current);
    }
  }, [decorateComponents]);

  // const isEditingCompleted =
  //   editingDecorateComponent?.typeContent &&
  //   Object.values(editingDecorateComponent?.typeContent).every((v) => {
  //     return v !== null;
  //   });

  const getUpdatedDecorateComponents = () => {
    const filteredDecorateComponents = decorateComponents.filter(
      (component) => component?.isUpdated === true,
    );
    return filteredDecorateComponents;
  };

  useEffect(() => {
    (async () => {
      if (id) {
        dispatchDecorateComponents({
          type: 'setAll',
          decorateComponents: [],
        });
        const page = await getPage(currentDailryPage.pageId);

        if (page.data?.elements.length > 0) {
          const datas = page.data?.elements.map((i) => ({
            ...i,
            initialStyle: {
              ...i.initialStyle,
              position: i?.position,
              size: i?.size,
              rotation: i?.rotation,
            },
          }));

          dispatchDecorateComponents({
            type: 'setAll',
            decorateComponents: datas,
          });
        }
      }
    })();
  }, [currentDailryPage]);

  return {
    decorateComponents,
    dispatchDecorateComponents,
    getUpdatedDecorateComponents,
    editingDecorateComponent,
  };
};

export default useDecorateComponents;
