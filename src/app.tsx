import React, { TargetedEvent } from 'preact/compat';
import type Preact from 'preact';

import { h } from 'preact';
import RandomUser from './classes/RandomUser';
import MainContainer from './components/MainContainer';
import { User, type RandomUserResponse } from './classes/types';
import { nanoid } from 'nanoid';
import { useTranslation, withTranslation } from 'react-i18next';
import { batch, computed, effect, signal } from '@preact/signals';
import CardItem from './components/atom/CardItem';
import './app.css';

export const signals = {
	loading: signal<boolean>(true),
	seed: signal<string>('1234'),
	angle: signal<number>(0),
	users: {
		results: signal<User[] | null>(null),
	},
	selected: signal<string>(''),
	swipe: signal<number>(1),
};

export const current = {
	loading: computed(() => signals.loading.value),
	seed: computed(() => signals.seed.value),
	angle: computed(() => signals.angle.value),
	users: {
		results: computed(() => signals.users.results.value),
	},
	selected: computed(() => signals.selected.value),
	swipe: computed(() => signals.swipe.value),
};

export const handle = {
	loading: (state: boolean) => (signals.loading.value = state),
	seed: ({ target }: any) => !!target.value && (signals.seed.value = target.value),
	angle: (deg: number) => !!deg && (signals.angle.value = deg),
	users: {
		results: (data: User[]) => data && (signals.users.results.value = data),
	},
	selected: (uuid: string) => !!uuid && (signals.selected.value = uuid),
	swipe: (value: number) => {
		console.log(value);
		const users = current.users.results.value;
		const currentId = users!.findIndex((el) => el.login.uuid === current.selected.value);
		if (value > 1) {
			batch(() => {
				const next = currentId + 1 >= users!.length ? 0 : currentId + 1;
				handle.angle(users![next].angle);
				handle.selected(users![next].login.uuid);
			});
		}
		if (value < 1) {
			batch(() => {
				const before = currentId - 1 <= 0 ? users!.length - 1 : currentId - 1;
				handle.angle(users![before].angle);
				handle.selected(users![before].login.uuid);
			});
		}
		return !!value && (signals.swipe.value = value);
	},
};

const retriveUsers = effect(() => {
	const data: RandomUser = new RandomUser({
		results: 12,
		seed: signals.seed.value,
		format: 'json',
		nat: ['br'],
		exc: ['registered', 'id'],
	});

	data
		.retrieve()
		.then((response) => {
			const original = (response as RandomUserResponse).results;
			const results = original.map((el, i) => ({ ...el, angle: 360 - i * 30 }));
			batch(() => {
				handle.users.results(results);
				handle.selected(results[0].login.uuid);
				handle.angle(results[0].angle);
				handle.loading(false);
			});
		})
		.catch((error) => {
			console.error(error);
		});
});

function App() {
	const { t } = useTranslation();

	return (
		<MainContainer>
			<div class="absolute bottom-0 w-3/4 md:w-1/4 whitespace-nowrap text-center z-50 bg-black rounded-t p-2">
				<label for="seed" class="mr-2 min-w-full text-center">
					{t('Seed')}
				</label>
				<input
					id="seed"
					type="text"
					value={signals.seed}
					onChange={handle.seed}
					class={`mr-2 w-2/4 md:w-3/4  ${current.loading ? 'cursor-not-allowed' : ''}`}
					disabled={current.loading}
					data-testid="test-input-seed"
				/>
				<button
					onClick={() => {
						handle.loading(true);
						handle.seed({ target: { value: nanoid() } });
						handle.angle(current.angle - 180);
					}}
					disabled={current.loading}
					class={current.loading ? 'cursor-not-allowed' : ''}
					data-testid="test-btn-random-seed"
				>
					🎲
				</button>
			</div>

			<div class="fixed h-full w-full m-0 p-0 top-0 z-40 opacity-0 md:hidden">
				<input
					type="range"
					min="0"
					max="2"
					class="h-full w-full"
					value={current.swipe}
					onInput={({ target }) => handle.swipe(target!.value)}
					onPointerUp={() => handle.swipe(1)}
				/>
			</div>
			<div
				id="roulette-container"
				class="m-0 flex justify-center"
				style={{
					transition: 'all 2s',
				}}
			>
				<CardItem angle={0} user={current.users.results?.value?.[0]} />
				<CardItem angle={30} user={current.users.results?.value?.[1]} />
				<CardItem angle={60} user={current.users.results?.value?.[2]} />
				<CardItem angle={90} user={current.users.results?.value?.[3]} />
				<CardItem angle={120} user={current.users.results?.value?.[4]} />
				<CardItem angle={150} user={current.users.results?.value?.[5]} />
				<CardItem angle={180} user={current.users.results?.value?.[6]} />
				<CardItem angle={210} user={current.users.results?.value?.[7]} />
				<CardItem angle={240} user={current.users.results?.value?.[8]} />
				<CardItem angle={270} user={current.users.results?.value?.[9]} />
				<CardItem angle={300} user={current.users.results?.value?.[10]} />
				<CardItem angle={330} user={current.users.results?.value?.[11]} />
			</div>
		</MainContainer>
	);
}

export default withTranslation()(App);
