/**
 * External dependencies
 */
import moment from 'moment';

/**
 * WordPress dependencies
 */
import { __, _x, sprintf } from '@wordpress/i18n';
import { __experimentalGetSettings, dateI18n } from '@wordpress/date';
import { useSelect } from '@wordpress/data';

/**
 * Internal dependencies
 */
import { store as editorStore } from '../../store';

export function getPostScheduleLabel( date, isFloating ) {
	if ( ! date || isFloating ) {
		return __( 'Immediately' );
	}

	const dateMoment = moment.tz( date, 'WP' );

	// If the user's timezone differs from the site's timezone, words like
	// 'Tomorrow' are probably going to be confusing, so just display the full
	// date and timezone.
	if ( dateMoment.utcOffset() !== moment().utcOffset() ) {
		return dateI18n(
			_x( 'F j, Y g:i a P', 'date format with timezone offset' ),
			dateMoment
		);
	}

	const nowMoment = moment.tz( 'WP' );

	const { formats } = __experimentalGetSettings();

	if ( dateMoment.isSame( nowMoment, 'day' ) ) {
		return sprintf(
			// translators: %s: Time of day the post is scheduled for.
			__( 'Today at %s' ),
			dateI18n( formats.time, dateMoment )
		);
	}

	if ( dateMoment.isSame( nowMoment.clone().add( 1, 'day' ), 'day' ) ) {
		return sprintf(
			// translators: %s: Time of day the post is scheduled for.
			__( 'Tomorrow at %s' ),
			dateI18n( formats.time, dateMoment )
		);
	}

	if ( dateMoment.isSame( nowMoment, 'year' ) ) {
		return dateI18n(
			_x( 'F j g:i a', 'date format without year' ),
			dateMoment
		);
	}

	return dateI18n( formats.datetime, dateMoment );
}

export default function PostScheduleLabel() {
	const { date, isFloating } = useSelect( ( select ) => ( {
		date: select( editorStore ).getEditedPostAttribute( 'date' ),
		isFloating: select( editorStore ).isEditedPostDateFloating(),
	} ) );

	return getPostScheduleLabel( date, isFloating );
}
