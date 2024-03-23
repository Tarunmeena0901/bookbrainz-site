/*
 * Copyright (C) 2018 Akhilesh Kumar <akhilesh5991@gmail.com>
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 2 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License along
 * with this program; if not, write to the Free Software Foundation, Inc.,
 * 51 Franklin Street, Fifth Floor, Boston, MA 02110-1301 USA.
 */

import {AppContainer} from 'react-hot-loader';
import Layout from '../containers/layout';
import React from 'react';
import ReactDOM from 'react-dom';
import StatisticsPage from '../components/pages/statistics';
import {extractLayoutProps} from '../helpers/props';
import { useSSR } from 'react-i18next';
import '../../i18n-client';
//import { I18nextProvider } from 'react-i18next';


const propsTarget = document.getElementById('props');
const props = propsTarget ? JSON.parse(propsTarget.innerHTML) : {};

//i18n.changeLanguage(window.__i18n.locale);
//i18n.addResourceBundle(window.__i18n.locale, 'common', window.__i18n.resources, true);

const Markup = () => {
	useSSR(window.__initialI18nStore , window.__initialLanguage)
	return(
		//<I18nextProvider i18n={i18n}>
			<AppContainer>
				<Layout {...extractLayoutProps(props)}>
					<StatisticsPage
						allEntities={props.allEntities}
						last30DaysEntities={props.last30DaysEntities}
						topEditors={props.topEditors}
					/>
				</Layout>
			</AppContainer>
		//</I18nextProvider>
	)
};

ReactDOM.hydrate(<Markup/>, document.getElementById('target'));

/*
 * As we are not exporting a component,
 * we cannot use the react-hot-loader module wrapper,
 * but instead directly use webpack Hot Module Replacement API
 */

if (module.hot) {
	module.hot.accept();
}
