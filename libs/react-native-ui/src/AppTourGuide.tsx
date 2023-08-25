import { css } from '@enterslash/enterus/utils';
import React from 'react';
import {
  TourGuideProvider,
  TourGuideZone,
  useTourGuideController,
} from 'rn-tourguide';

type StepProp = {
  children: React.ReactNode;
  shape?: 'circle' | 'rectangle';
  zone: number;
  text: string;
}

class AppTourGuide {
  static Step = (prop: StepProp) => {
    return (
      <TourGuideZone shape={prop.shape || 'rectangle'} zone={prop.zone} text={prop.text}>
        {prop.children}
      </TourGuideZone>
    )
  };
  static Provider = (prop: { children: React.ReactNode }) => {
    return (
      <TourGuideProvider
        androidStatusBarVisible
        preventOutsideInteraction
        {...{ borderRadius: css.border.radius.sm,  }}
      >
        {prop.children}
      </TourGuideProvider>
    );
  };
  static RegisterTourEventListener = (
    eventEmitter: any,
    {
      onFinish,
      onChangeStep,
    }: { onFinish: () => void; onChangeStep: (data: any) => void }
  ) => {
    React.useEffect(() => {
      eventEmitter.on('stop', onFinish);
      eventEmitter.on('stepChange', onChangeStep);
      return () => {
        eventEmitter.off('stop', onFinish);
        eventEmitter.off('stepChange', onChangeStep);
      };
    }, []);
  };
}

export { AppTourGuide, useTourGuideController as useAppTourGuide };
