import Joyride, { Step, CallBackProps } from 'react-joyride';

type ProductTourProps = {
  run: boolean;
  onComplete: () => void;
};

export default function ProductTour({ run, onComplete }: ProductTourProps) {
  const steps: Step[] = [
    {
      target: 'body',
      content: 'Welcome to the Sales Enablement Copilot! Let me show you around.',
      placement: 'center',
      disableBeacon: true,
    },
    {
      target: '[data-tour="sidebar"]',
      content: 'Use the sidebar to navigate. The Copilot section contains Ask and Conversations features.',
      placement: 'right',
    },
    {
      target: '[data-tour="ask-input"]',
      content: 'Start here by asking questions about demos, case studies, or proof points. The AI will provide recommendations based on your deal context.',
      placement: 'bottom',
    },
    {
      target: '[data-tour="context-chips"]',
      content: 'Select a deal to scope your queries. Context chips show the active deal, industry, stage, and cloud provider.',
      placement: 'bottom',
    },
    {
      target: '[data-tour="deals-nav"]',
      content: 'View your entire deals pipeline organized by stage in a kanban board.',
      placement: 'right',
    },
    {
      target: '[data-tour="conversations-nav"]',
      content: 'Access your conversation history to maintain context across all AI interactions.',
      placement: 'right',
    },
    {
      target: '[data-tour="help-button"]',
      content: 'Click here anytime to see the welcome guide or restart this tour.',
      placement: 'bottom',
    },
  ];

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { status } = data;
    if (status === 'finished' || status === 'skipped') {
      onComplete();
    }
  };

  return (
    <Joyride
      steps={steps}
      run={run}
      continuous
      showProgress
      showSkipButton
      callback={handleJoyrideCallback}
      styles={{
        options: {
          primaryColor: '#000000',
          zIndex: 10000,
        },
        buttonNext: {
          backgroundColor: '#000000',
          color: '#ffffff',
          borderRadius: '8px',
          padding: '8px 16px',
        },
        buttonBack: {
          color: '#000000',
          borderRadius: '8px',
          padding: '8px 16px',
        },
        buttonSkip: {
          color: '#666666',
        },
      }}
    />
  );
}
