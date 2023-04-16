import { batch } from '@preact/signals';
import { handle, signals } from '..';

export default (state: boolean) => {
	batch(() => {
		state && handle.selected(false);
		signals.spin.value = state;
	});
};
