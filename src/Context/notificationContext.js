import createUseContext from "constate"
import { Button, notification } from 'antd';

const useNotification = ({ initialData = {} }) => {
  const [api, contextHolder] = notification.useNotification();

  const openNotification = ({message, description, duration}) => {
    api.open({
      message,
      description,
      duration: 0,
    });
  };

  return {
    openNotification,
    contextHolder
  };
}

const [NotificationContextProvider, useNotificationContext] = createUseContext(useNotification)

export { NotificationContextProvider, useNotificationContext }

