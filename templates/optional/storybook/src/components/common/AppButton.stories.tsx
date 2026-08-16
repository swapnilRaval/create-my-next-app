import type { Meta, StoryObj } from '@storybook/nextjs';
import { AppButton } from '@/components/common/AppButton';

const meta: Meta<typeof AppButton> = {
  title: 'Common/AppButton',
  component: AppButton,
};

export default meta;

type Story = StoryObj<typeof AppButton>;

export const Primary: Story = {
  args: {
    variant: 'contained',
    children: 'Save',
  },
};
