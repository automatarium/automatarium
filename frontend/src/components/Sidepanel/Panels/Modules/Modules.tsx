import { SectionLabel, Preference, Switch, Button, Input, Modal } from '/src/components';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useModuleStore, useModulesStore, useProjectStore } from '/src/stores';
import { createNewModuleProject, ModuleProject } from '@/stores/useModuleStore';
import { Wrapper, RemoveButton, EditButton, TextArea, Table, TitleSection, ButtonContainer, FieldWrapper, DescriptionText } from './modulesStyle';
import { ProjectType } from '/src/types/ProjectTypes';
import { exportModuleFile } from '/src/hooks/useActions';
import { dispatchCustomEvent } from '/src/util/events';
import { Plus } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Modules = () => {
  const setModuleProjects = useModuleStore(s => s.setProjects);
  const setModuleDescription = useModuleStore(s => s.setModuleDescription);
  const setModuleName = useModuleStore(s => s.setName);
  const deleteQuestionFromModule = useModuleStore(s => s.deleteQuestion);
  const addQuestionToModule = useModuleStore(s => s.upsertQuestion);
  const deleteProjectFromModule = useModuleStore(s => s.deleteProject);
  const updateProjectToModule = useModuleStore(s => s.upsertProject);
  const currentModule = useModuleStore(s => s.module);
  const showModuleWindow = useModuleStore(s => s.showModuleWindow);
  const setShowModuleWindow = useModuleStore(s => s.setShowModuleWindow);
  const updateModule = useModulesStore(s => s.upsertModule);
  const setProject = useProjectStore(s => s.set);
  const currentProject = useProjectStore(s => s.project);
  const setAllProjectNames = useModuleStore(s => s.setAllProjectNames);
  const setProjectName = useProjectStore(s => s.setName);
  const { t } = useTranslation('common');

  const [isTitleEditing, setTitleIsEditing] = useState(false);
  const [titleInput, setTitleInput] = useState('');
  const [titleDescription, setTitleDescription] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<ModuleProject | null>(null);

  useEffect(() => {
    if (currentModule) {
      setTitleInput(currentModule.meta.name || '');
      setTitleDescription(currentModule.description || '');
    }
  }, [currentModule]);

  const handleEditClick = () => {
    if (currentModule) {
      setTitleInput(currentModule.meta.name || '');
      setTitleDescription(currentModule.description || '');
    }
    setTitleIsEditing(true);
  };

  const handleEditSaveClick = () => {
    setModuleName(titleInput);
    setModuleDescription(titleDescription);
    setProjectName(titleInput);
    setAllProjectNames(titleInput);
    setTitleIsEditing(false);
    saveModule();
  };

  const handleCancelClick = () => {
    if (currentModule) {
      setTitleInput(currentModule.meta.name || '');
      setTitleDescription(currentModule.description || '');
    }
    setTitleIsEditing(false);
  };

  const saveModule = () => {
    const project = useProjectStore.getState().project;
    if (!project) return;

    updateProjectToModule({ ...project, meta: { ...project.meta, dateEdited: Date.now() } });
    if (currentModule) updateModule(currentModule);
  };

  const handleAddQuestionClick = () => setIsModalOpen(true);

  const { register, handleSubmit } = useForm<{ questionType: ProjectType }>({ defaultValues: { questionType: 'FSA' } });
  const handleAddQuestion = (data: { questionType: ProjectType }) => {
    const newModuleProject = createNewModuleProject(data.questionType);
    updateProjectToModule(newModuleProject);
    addQuestionToModule(newModuleProject._id, '');
    setProject(newModuleProject);
    setIsModalOpen(false);
  };

  const handleEditQuestion = (_project: ModuleProject) => {
    saveModule();
    setProject(_project);
    if (!showModuleWindow) setShowModuleWindow(true);
  };

  const handleOpenQuestion = (_project: ModuleProject) => {
    saveModule();
    setProject(_project);
  };

  const handleDeleteQuestion = (_project: ModuleProject) => {
    setProjectToDelete(_project);
    setIsDeleteModalOpen(true);
  };

  const confirmDeleteQuestion = () => {
    if (!projectToDelete) return;

    deleteProjectFromModule(projectToDelete._id);
    deleteQuestionFromModule(projectToDelete._id);

    if (projectToDelete._id === (currentProject?._id) && currentModule) {
      const remainingProjects = currentModule.projects.filter((proj) => proj._id !== projectToDelete._id);
      if (remainingProjects.length > 0) setProject(remainingProjects[0]);
    }

    setIsDeleteModalOpen(false);
    setProjectToDelete(null);
  };

  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const handleDragStart = (index: number) => setDraggedIndex(index);

  const handleDrop = (dropIndex: number) => {
    if (!currentModule) return;
    if (draggedIndex === null || draggedIndex === dropIndex) return;
    const updatedProjects = [...currentModule.projects];
    const [movedProject] = updatedProjects.splice(draggedIndex, 1);
    updatedProjects.splice(dropIndex, 0, movedProject);
    setModuleProjects(updatedProjects);
    setDraggedIndex(null);
  };

  const handleDragOver = (e: React.DragEvent<HTMLTableRowElement>) => e.preventDefault();

  const handleExportModule = () => exportModuleFile();
  const handleCreateModule = () => dispatchCustomEvent('modal:createModule', { project: true });

  return (
    <>
      <SectionLabel>{t('module_panel.current')}</SectionLabel>
      {!currentModule ? (
        <Wrapper>
          {t('module_panel.not_working')}
          <Button icon={<Plus />} onClick={handleCreateModule}>
            {t('module_panel.modularise')}
          </Button>
        </Wrapper>
      ) : (
        <>
          <Wrapper>
            {isTitleEditing ? (
              <>
                <TitleSection>
                  <TextArea
                    value={titleInput}
                    onChange={(e) => setTitleInput(e.target.value)}
                    rows={1}
                    placeholder={t('module_panel.placeholder_title')}
                    maxLength={30}
                  />
                </TitleSection>
                <TextArea
                  value={titleDescription}
                  onChange={(e) => setTitleDescription(e.target.value)}
                  rows={4}
                  placeholder={t('module_panel.placeholder_desc')}
                />
                <ButtonContainer>
                  <Button onClick={handleCancelClick}>{t('cancel')}</Button>
                  <Button onClick={handleEditSaveClick}>{t('save')}</Button>
                </ButtonContainer>
              </>
            ) : (
              <>
                <TitleSection>
                  <h2>{currentModule?.meta.name || t('create_module.untitled')}</h2>
                </TitleSection>
                <DescriptionText>{currentModule?.description || ''}</DescriptionText>
                <Button onClick={handleEditClick}>{t('menus.edit')}</Button>
              </>
            )}
          </Wrapper>

          <SectionLabel>{t('module_panel.settings')}</SectionLabel>
          <Wrapper>
            <Preference label={t('module_panel.open_questions')}>
              <Switch type="checkbox" checked={showModuleWindow} onChange={() => setShowModuleWindow(!showModuleWindow)} />
            </Preference>
          </Wrapper>

          <SectionLabel>{t('module_panel.questions')}</SectionLabel>
          <Wrapper>
            <Table>
              <thead>
                <tr>
                  <th>{t('module_panel.question')}</th>
                  <th>{t('module_panel.actions')}</th>
                </tr>
              </thead>
              <tbody>
                {currentModule.projects.map((q, index) => (
                  <tr
                    key={q._id}
                    style={{ backgroundColor: currentProject && currentProject._id === q._id ? 'var(--toolbar)' : 'transparent' }}
                    draggable={currentProject && currentProject._id === q._id}
                    onDragStart={() => handleDragStart(index)}
                    onDrop={() => handleDrop(index)}
                    onDragOver={handleDragOver}
                  >
                    <td onClick={() => handleOpenQuestion(q)}>{t('module_panel.question_id', { id: index + 1 })}</td>
                    <td>
                      <EditButton onClick={() => handleEditQuestion(q)}>{t('menus.edit')}</EditButton>
                      <RemoveButton onClick={() => handleDeleteQuestion(q)} disabled={currentModule.projects.length <= 1}>
                        {t('module_panel.remove')}
                      </RemoveButton>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
            <Button icon={<Plus />} onClick={handleAddQuestionClick}>
              {t('module_panel.add_question')}
            </Button>
          </Wrapper>

          <Modal
            title={t('module_panel.add_question_title')}
            description={t('module_panel.add_question_desc')}
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            actions={
              <>
                <Button secondary onClick={() => setIsModalOpen(false)}>
                  {t('cancel')}
                </Button>
                <Button type="submit" form="question_type_form">
                  {t('save')}
                </Button>
              </>
            }
            style={{ paddingInline: 0 }}
          >
            <form id="question_type_form" onSubmit={handleSubmit(handleAddQuestion)}>
              <SectionLabel>{t('module_panel.question_type')}</SectionLabel>
              <FieldWrapper>
                <span>{t('module_panel.select_type')}</span>
                <Input type="select" small {...register('questionType')}>
                  <option value="FSA">{t('fsa_short')}</option>
                  <option value="PDA">{t('pda_short')}</option>
                  <option value="TM">{t('tm_short')}</option>
                </Input>
              </FieldWrapper>
            </form>
          </Modal>

          <Modal
            title={t('module_panel.delete_question_title')}
            description={t('module_panel.delete_question_desc')}
            isOpen={isDeleteModalOpen}
            onClose={() => {
              setIsDeleteModalOpen(false);
              setProjectToDelete(null);
            }}
            actions={
              <>
                <Button
                  secondary
                  onClick={() => {
                    setIsDeleteModalOpen(false);
                    setProjectToDelete(null);
                  }}
                >
                  {t('cancel')}
                </Button>
                <Button onClick={confirmDeleteQuestion}>{t('delete')}</Button>
              </>
            }
          />

          <SectionLabel>{t('export')}</SectionLabel>
          <Wrapper>
            <Button onClick={handleExportModule}>{t('module_panel.export_automatarium')}</Button>
            <Button onClick={() => dispatchCustomEvent('showModuleSharing', null)}>{t('module_panel.export_url')}</Button>
          </Wrapper>
        </>
      )}
    </>
  );
};

export default Modules;
