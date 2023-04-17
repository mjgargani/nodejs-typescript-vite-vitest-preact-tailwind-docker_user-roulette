import React from 'preact/compat';

import type Preact from 'preact';
import './styles.css';
import { current } from '@/components/signals';
import { ComponentChildren } from 'preact';

type MainContainerProps = {
	children: ComponentChildren;
};

function MainContainer({ children }: MainContainerProps) {
	return (
		<div id="main-container" class={`${current.loading.value ? '!cursor-wait' : ''}`}>
			{children}
		</div>
	);
}

export default MainContainer;
