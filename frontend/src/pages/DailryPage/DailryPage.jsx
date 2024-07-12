// Da-ily 회원, 비회원, 다일리 있을때, 없을때를 조건문으로 나눠서 렌더링
import { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
// import { useNavigate } from 'react-router-dom';
import html2canvas from 'html2canvas';
import saveAs from 'file-saver';
import 'react-toastify/dist/ReactToastify.css';
import * as S from './DailryPage.styled';
import Text from '../../components/common/Text/Text';
import ToolButton from '../../components/ToolButton/ToolButton';
import {
  DECORATE_TOOLS,
  DECORATE_TOOLS_TOOLTIP,
  PAGE_TOOLS,
  PAGE_TOOLS_TOOLTIP,
} from '../../constants/toolbar';
import { postPage, patchPage } from '../../apis/dailryApi';
import { DECORATE_TYPE, EDIT_MODE } from '../../constants/decorateComponent';
import DecorateWrapper from '../../components/decorate/DecorateWrapper';
import TypedDecorateComponent from '../../components/decorate/TypedDecorateComponent';
import { TEXT } from '../../styles/color';
import MoveableComponent from '../../components/Moveable/Moveable';
import usePageData from '../../hooks/usePageData';
import { DecorateComponentDeleteButton } from '../../components/decorate/DeleteButton/DeleteButton.styled';
import Tooltip from '../../components/common/Tooltip/Tooltip';
import PageNavigator from '../../components/dailryPage/pageList/PageNavigator/PageNavigator';
import { PATH_NAME } from '../../constants/routes';
import { useDailryContext } from '../../hooks/useDailryContext';
import useDecorateComponents from '../../hooks/decorateComponent/useDecorateComponents';
import { getRelativePosition } from '../../hooks/useNewDecorateComponent/createNewDecorateComponent';
import useCheckClickedEl from '../../hooks/decorateComponent/useCheckClickedEl';
// import { PATH_NAME } from '../../constants/routes';

const DailryPage = () => {
  const pageRef = useRef(null);
  const moveableRef = useRef([]);
  // const navigate = useNavigate();
  const { currentDailryPage, setCurrentDailry } = useDailryContext();

  const [target, setTarget] = useState(null);

  const [selectedTool, setSelectedTool] = useState(null);

  const [deletedDecorateComponentIds, setDeletedDecorateComponentIds] =
    useState([]);
  // const [pageId, setPageId] = useState(0);

  const navigate = useNavigate();
  const params = useParams();
  const dailryId = Number(params.dailryId);
  const pageNumber = Number(params.pageNumber);

  const {
    decorateComponents,
    dispatchDecorateComponents,
    getUpdatedDecorateComponents,
    editingDecorateComponent,
  } = useDecorateComponents();
  useCheckClickedEl(editingDecorateComponent, dispatchDecorateComponents);

  const [editMode, setEditMode] = useState(null);

  const { appendPageDataToFormData, formData } = usePageData(
    getUpdatedDecorateComponents(),
  );

  const patchPageData = () => {
    setTarget(null);

    setTimeout(async () => {
      const pageImg = await html2canvas(pageRef.current);

      pageImg.toBlob(async (pageImageBlob) => {
        appendPageDataToFormData(
          pageImageBlob,
          getUpdatedDecorateComponents(),
          deletedDecorateComponentIds,
        );

        await patchPage(currentDailryPage.pageId, formData);
      });

      dispatchDecorateComponents({ type: 'setUpdateIsDone' });
    }, 100);
  };

  const isMoveable = () => target && editMode === EDIT_MODE.COMMON_PROPERTY;

  const deleteDecorateComponent = (id) => {
    if (!deletedDecorateComponentIds.some((d) => d.id === id)) {
      setDeletedDecorateComponentIds((prev) => [...prev, id]);
    }

    dispatchDecorateComponents({ type: 'delete', id });

    setTarget(null);
  };

  useEffect(() => {
    setTimeout(() => {
      if (getUpdatedDecorateComponents().length > 0) {
        patchPageData();
      }

      dispatchDecorateComponents({ type: 'setUpdateIsDone' });
    }, 1000);

    // setPageId(
    //   dailryData.length !== 0
    //     ? dailryData.pages.find((page) => page.pageNumber === pageNumber).pageId
    //     : 0,
    // );
  }, [currentDailryPage]);

  const handleDownloadClick = async () => {
    try {
      const pageImg = await html2canvas(pageRef.current);
      pageImg.toBlob((pageImageBlob) => {
        if (pageImageBlob !== null) {
          saveAs(pageImageBlob, `dailry${dailryId}_${currentDailryPage}.png`);
        }
      });
    } catch (e) {
      console.error('이미지 변환 오류', e);
    }
  };

  const handleClickPage = (e) => {
    if (selectedTool === null || selectedTool === DECORATE_TYPE.MOVING) {
      return;
    }
    const position = getRelativePosition(e, pageRef);

    setTimeout(() => {
      dispatchDecorateComponents({
        type: 'create',
        position,
        decorateComponentType: selectedTool,
        order: decorateComponents?.length,
      });
    }, 100);
  };

  const handleClickDecorate = (e, index) => {
    e.stopPropagation();

    if (selectedTool === DECORATE_TYPE.MOVING) {
      setTarget(index + 1);
    }
  };
  return dailryId ? (
    <S.FlexWrapper>
      <S.CanvasWrapper ref={pageRef} onMouseDown={handleClickPage}>
        {decorateComponents?.map((element, index) => {
          const canEdit =
            editMode === EDIT_MODE.TYPE_CONTENT &&
            element?.type === selectedTool &&
            (element?.editType === 'setTypeContent' ||
              element?.editType === 'create');
          return (
            <DecorateWrapper
              key={element?.id}
              onMouseDown={(e) => {
                if (element?.editType === 'create') {
                  e.stopPropagation();
                }
                handleClickDecorate(e, index, element);
              }}
              setTarget={setTarget}
              index={index}
              canEdit={canEdit}
              ref={(el) => {
                moveableRef[index + 1] = el;
              }}
              {...element}
            >
              {(target === index + 1 ||
                element?.editType === 'setTypeContent') && (
                <DecorateComponentDeleteButton
                  onClick={() => {
                    deleteDecorateComponent(element?.id);
                  }}
                >
                  삭제
                </DecorateComponentDeleteButton>
              )}

              <TypedDecorateComponent
                id={element?.id}
                type={element?.type}
                typeContent={element?.typeContent}
                canEdit={canEdit}
                dispatchDecorateComponents={dispatchDecorateComponents}
              />
            </DecorateWrapper>
          );
        })}
        {isMoveable() && (
          <MoveableComponent
            target={moveableRef[target]}
            setCommonProperty={dispatchDecorateComponents}
          />
        )}
      </S.CanvasWrapper>
      <S.SideWrapper>
        <S.ToolWrapper>
          {DECORATE_TOOLS.map(({ icon, type }, index) => {
            const onSelect = (t) => {
              setSelectedTool(selectedTool === t ? null : t);
              if (t === DECORATE_TYPE.MOVING) {
                setEditMode(EDIT_MODE.COMMON_PROPERTY);
              } else {
                setEditMode(EDIT_MODE.TYPE_CONTENT);
              }
            };
            return (
              <Tooltip key={index} text={DECORATE_TOOLS_TOOLTIP[type]}>
                <ToolButton
                  icon={icon}
                  selected={selectedTool === type}
                  onSelect={() => onSelect(type)}
                />
              </Tooltip>
            );
          })}
          {PAGE_TOOLS.map(({ icon, type }, index) => {
            const onSelect = async (t) => {
              setSelectedTool(selectedTool === t ? null : t);
              setTimeout(() => {
                setSelectedTool(null);
              }, 150);
              if (t === 'add') {
                if (
                  getUpdatedDecorateComponents().length > 0 &&
                  window.confirm(
                    '저장 하지 않은 꾸미기 컴포넌트가 존재합니다. 저장하시겠습니까?',
                  )
                ) {
                  patchPageData();
                }
                dispatchDecorateComponents({ type: 'setUpdateIsDone' });
                const res = await postPage(dailryId);
                if (res) {
                  const {
                    pageId,
                    pageNumber: newPageNumber,
                    thumbnail,
                  } = res.data;
                  setCurrentDailry((prev) => ({
                    ...prev,
                    pages: [
                      ...prev.pages,
                      {
                        pageId,
                        pageNumber: newPageNumber,
                        thumbnail,
                      },
                    ],
                  }));
                  navigate(`/dailry/${dailryId}/${newPageNumber}`);
                }
              }
              if (t === 'download') {
                await handleDownloadClick();
              }
              if (t === 'save') {
                patchPageData();
              }
              if (t === 'share') {
                navigate(
                  `${PATH_NAME.CommunityWrite}?type=post&pageImage=${currentDailryPage.thumbnail}`,
                );
              }
            };
            return (
              <Tooltip key={index} text={PAGE_TOOLS_TOOLTIP[type]}>
                <ToolButton
                  key={index}
                  icon={icon}
                  selected={selectedTool === type}
                  onSelect={() => onSelect(type)}
                />
              </Tooltip>
            );
          })}
        </S.ToolWrapper>
        <PageNavigator pageNumber={pageNumber} />
      </S.SideWrapper>
    </S.FlexWrapper>
  ) : (
    <S.NoCanvas>
      <Text size={30} weight={1000} color={TEXT.disabled}>
        다일리 또는 페이지를 선택하거나 만들어주세요
      </Text>
    </S.NoCanvas>
  );
};

export default DailryPage;
