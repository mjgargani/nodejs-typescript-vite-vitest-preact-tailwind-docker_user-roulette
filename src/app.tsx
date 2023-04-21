import React, { useRef } from 'preact/compat';
import type Preact from 'preact';
import { h } from 'preact';
import { useTranslation, withTranslation } from 'react-i18next';

import { handle } from '@/components/signals';
import MainContainer from '@/components/templates/MainContainer';
import Seed from '@/components/atom/Seed';
import Swipe from '@/components/atom/Swipe';
import Roulette from '@/components/molecules/Roulette';

import { fetchEffect } from '@/classes/retrieveData';

import clickMp3 from '@/assets/click.mp3';
import clickWav from '@/assets/click.wav';
import clickOgg from '@/assets/click.ogg';
import Audio from './components/atom/Audio';
import Filters from './components/atom/Filters';
import Shields from './components/atom/Shields';
import Router, { type CustomHistory, route } from 'preact-router';
import { createHashHistory } from 'history';

function App() {
	fetchEffect();
	handle.i18next(useTranslation());

	return (
		<Router
			history={createHashHistory() as unknown as CustomHistory}
			onChange={({ matches }) => {
				handle.seed(matches?.seed ?? '');
			}}
		>
			<div path="/:seed?" class="flex justify-center">
				<Audio
					name="click"
					src={[
						['mp3', clickMp3],
						['wav', clickWav],
						['ogg', clickOgg],
					]}
				/>
				<Shields />
				<Filters />
				<Seed />
				<MainContainer>
					<Swipe />
					<Roulette />
				</MainContainer>
			</div>
		</Router>
	);
}

export default withTranslation()(App);
