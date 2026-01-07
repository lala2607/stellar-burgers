import React, { FC } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import clsx from 'clsx';
import styles from './app-header.module.css';
import { TAppHeaderUIProps } from './type';
import { BurgerIcon, ListIcon, Logo, ProfileIcon } from '@zlden/react-developer-burger-ui-components';

export const AppHeaderUI: FC<TAppHeaderUIProps> = ({ userName }) => {
  const location = useLocation();
  
  const pathConfig = {
    isConstructor: location.pathname === '/',
    isFeed: location.pathname === '/feed',
    isProfile: location.pathname === '/profile' || location.pathname.startsWith('/profile')
  };

  const navItems = [
    {
      to: '/',
      icon: <BurgerIcon type={pathConfig.isConstructor ? 'primary' : 'secondary'} />,
      text: 'Конструктор',
      testId: 'constructor-link'
    },
    {
      to: '/feed',
      icon: <ListIcon type={pathConfig.isFeed ? 'primary' : 'secondary'} />,
      text: 'Лента заказов',
      testId: 'feed-link'
    },
    {
      to: '/profile',
      icon: <ProfileIcon type={pathConfig.isProfile ? 'primary' : 'secondary'} />,
      text: userName || 'Личный кабинет',
      testId: 'profile-link'
    }
  ];

  return (
    <header className={styles.header}>
      <nav className={`${styles.menu} p-4`}>
        <div className={styles.menu_part_left}>
          {navItems.slice(0, 2).map((item, index) => (
            <NavLink
              key={index}
              to={item.to}
              className={({ isActive }) =>
                clsx(styles.link, isActive && styles.active)
              }
              data-testid={item.testId}
            >
              {item.icon}
              <p className='text text_type_main-default ml-2'>
                {item.text}
                {index === 0 && <span className='mr-10'></span>}
              </p>
            </NavLink>
          ))}
        </div>
        
        <div className={styles.logo}>
          <NavLink to='/'>
            <Logo className='' />
          </NavLink>
        </div>
        
        <div className={styles.link_position_last}>
          <NavLink
            to={navItems[2].to}
            className={({ isActive }) =>
              clsx(styles.link, isActive && styles.active)
            }
            data-testid={navItems[2].testId}
          >
            {navItems[2].icon}
            <p className='text text_type_main-default ml-2'>
              {navItems[2].text}
            </p>
          </NavLink>
        </div>
      </nav>
    </header>
  );
};