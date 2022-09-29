import { render, screen } from '@testing-library/react';
import Checkbox from './Checkbox';

// TODO: Worth a look - https://www.npmjs.com/package/shadow-dom-testing-library

const log = ( ...args ) => console.__proto__.log.call( console, ...args );

describe( 'Checkbox', () => {
	it( 'should render the checkbox', () => {
		const { container } = render( <Checkbox /> );
		log( 'container', container );
		expect( 1 ).toBe( 1 );
		// expect( container ).toMatchSnapshot();
	} );

	// it( 'should work as a controlled input', () => {
	// 	const { container } = render(
	// 		<Checkbox />
	// 	);
	// } );
} );

