export type TCPRoute = {
  [key: string]: {
    [key: string]: {
      message: {
        role: string;
        cmd: string;
      };
      sendUser: boolean;
    };
  };
};
