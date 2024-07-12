import { getCommonDecorateComponentProperties } from '../useNewDecorateComponent/createNewDecorateComponent';
import { typedDecorateComponentProperties } from '../useNewDecorateComponent/properties';

export const decorateComponentsReducer = (decorateComponents, action) => {
  switch (action.type) {
    case 'setAll': {
      return [...decorateComponents].concat(action.decorateComponents);
    }
    case 'create': {
      const { position, decorateComponentType, order } = action;

      return [
        ...decorateComponents,
        {
          ...getCommonDecorateComponentProperties(position),
          ...typedDecorateComponentProperties[action.decorateComponentType],
          type: decorateComponentType,
          order,
          editType: action.type,
        },
      ];
    }

    case 'setTypeContent': {
      const { id, newTypeContent } = action;

      const newDecorateComponent = {
        ...decorateComponents.find((c) => c.id === id),
        typeContent: newTypeContent,
        isUpdated: true,
      };

      return decorateComponents.with(
        decorateComponents.findIndex((c) => c.id === id),
        newDecorateComponent,
      );
    }

    case 'setCommonProperty': {
      const { id, position, rotation, size } = action;
      const newDecorateComponent = {
        ...decorateComponents.find((c) => c.id === id),
        position: position
          ? {
              x: position.x + position.x,
              y: position.y + position.y,
            }
          : position,
        rotation: rotation ?? rotation,
        size: size ?? size,
        isUpdated: true,
      };
      return [...decorateComponents, newDecorateComponent];
    }

    case 'delete': {
      return [...decorateComponents].filter((d) => d.id !== action.id);
    }
    case 'setUpdateIsDone': {
      return [...decorateComponents].map((component) => {
        if (component.isUpdated) {
          return { ...component, isUpdated: false };
        }
        return { ...component };
      });
    }
    default: {
      throw Error(`Unknown action:${action.type}`);
    }
  }
};
