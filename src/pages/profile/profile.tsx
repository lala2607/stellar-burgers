import { ProfileUI } from '@ui-pages';
import { FC, SyntheticEvent, useEffect, useState } from 'react';
import { useSelector, useDispatch } from '../../services/store';
import { getUser } from '../../services/selectors';
import { updateUserApi } from '@api';
import { checkUserAuth } from '../../services/slices/authSlice';

export const Profile: FC = () => {
  const dispatch = useDispatch();
  const user = useSelector(getUser);
  const [formValue, setFormValue] = useState({
    name: user?.name || '',
    email: user?.email || '',
    password: ''
  });

  useEffect(() => {
    setFormValue((prevState) => ({
      ...prevState,
      name: user?.name || '',
      email: user?.email || ''
    }));
  }, [user]);

  const isFormChanged =
    formValue.name !== user?.name ||
    formValue.email !== user?.email ||
    !!formValue.password;
const handleSubmit = async (e: SyntheticEvent) => {
  e.preventDefault();
  
  try {
    const updateData = {
      ...(formValue.name !== user?.name && { name: formValue.name }),
      ...(formValue.email !== user?.email && { email: formValue.email }),
      ...(formValue.password && { password: formValue.password })
    };

    if (Object.keys(updateData).length === 0) {
      return;
    }
    
    await updateUserApi(updateData);
    dispatch(checkUserAuth());

    setFormValue(prev => ({ ...prev, password: '' }));
    
  } catch (error) {
    console.error('Ошибка обновления профиля:', error);
  }
};

  const handleCancel = (e: SyntheticEvent) => {
    e.preventDefault();
    setFormValue({
      name: user?.name || '',
      email: user?.email || '',
      password: ''
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormValue((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <ProfileUI
      formValue={formValue}
      isFormChanged={isFormChanged}
      handleCancel={handleCancel}
      handleSubmit={handleSubmit}
      handleInputChange={handleInputChange}
    />
  );
};
