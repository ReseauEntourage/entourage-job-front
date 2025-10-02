import { Api } from '@/src/api';
import { createNudgeOption } from '@/src/constants/nudges';

export const loadNudgesOptions = async (userRole, callback) => {
  try {
    const { data: nudges } = await Api.getAllNudges({
      search: '',
      limit: 50,
      offset: 0,
    });
    callback([
      ...nudges.map((n) => createNudgeOption(userRole, n)).filter((n) => n),
    ]);
  } catch (error) {
    console.error(error);
    callback([]);
  }
};

export const loadSkillsOptions = async (callback, inputValue) => {
  try {
    const { data: skills } = await Api.getAllSkills({
      search: inputValue,
      limit: 50,
      offset: 0,
    });
    callback([
      ...skills.map((u) => {
        return {
          value: u.name,
          label: u.name,
        };
      }),
    ]);
  } catch (error) {
    console.error(error);
    callback([]);
  }
};

export const loadLanguagesOptions = async (callback, inputValue) => {
  try {
    const { data: businessSectors } = await Api.getAllLanguages({
      search: inputValue,
      limit: 50,
      offset: 0,
    });
    callback([
      ...businessSectors.map((u) => {
        return {
          value: u.id,
          label: u.name,
        };
      }),
    ]);
  } catch (error) {
    console.error(error);
    callback([]);
  }
};

export const loadBusinessSectorsOptions = async (callback, inputValue) => {
  try {
    const { data: businessSectors } = await Api.getAllBusinessSectors({
      search: inputValue,
      limit: 50,
      offset: 0,
    });
    callback([
      ...businessSectors.map((u) => {
        return {
          value: u.id,
          label: u.name,
        };
      }),
    ]);
  } catch (error) {
    console.error(error);
    callback([]);
  }
};

export const loadDepartmentsOptions = async (callback, inputValue) => {
  try {
    const { data: departments } = await Api.getAllDepartments({
      search: inputValue,
    });
    callback([
      ...departments.map((u) => {
        return {
          value: u.id,
          label: `${u.value} - ${u.name}`,
        };
      }),
    ]);
  } catch (error) {
    console.error(error);
    callback([]);
  }
};
