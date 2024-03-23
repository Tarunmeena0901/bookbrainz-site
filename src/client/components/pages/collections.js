/*
 * Copyright (C) 2020 Prabal Singh
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

import CollectionsTable from './parts/collections-table';
import PagerElement from './parts/pager';
import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';


function CollectionsPage(props) {
	const [querySearchParams, setQuerySearchParams] = useState(props.type ? `type=${props.type}` : '');
	const [results, setResults] = useState(props.results);
	const [type, setType] = useState(props.type);
	const paginationUrl = './collections/collections';
  
	const searchResultsCallback = (newResults) => {
	  setResults(newResults);
	};
  
	const handleTypeChange = (newType) => {
	  const newQuerySearchParams = newType ? `type=${newType}` : '';
	  setQuerySearchParams(newQuerySearchParams);
	  setType(newType);
	};
  
	const searchParamsChangeCallback = (searchParams) => {
	  const newType = searchParams.get('type') ?? '';
	  if (newType !== type) {
		setQuerySearchParams(`?${searchParams.toString()}`);
		setType(newType);
	  }
	};

	const {t , i18n} = useTranslation();
	const lngs = {
		en: { nativeName: 'English' },
		es: { nativeName: 'Spanish' }
	};
  
	useEffect(() => {
	  // This effect will trigger when `props.results` or `props.type` changes
	  setResults(props.results);
	  setType(props.type);
	  setQuerySearchParams(props.type ? `type=${props.type}` : '');
	}, [props.results, props.type]);
  
	return (
	  <div id="pageWithPagination">
		<div>
            {Object.keys(lngs).map((lng) => (
                <button key={lng} style={{ fontWeight: i18n.resolvedLanguage === lng ? 'bold' : 'normal' }} type="submit" onClick={() => i18n.changeLanguage(lng)}>
                    {lngs[lng].nativeName}
                </button>
            ))}
        </div>	
		{t('home.home_about')}
		<CollectionsTable
		  entityTypes={props.entityTypes}
		  ownerId={props.editor ? props.editor.id : null}
		  results={results}
		  showIfOwnerOrCollaborator={props.showIfOwnerOrCollaborator}
		  showLastModified={props.showLastModified}
		  showOwner={props.showOwner}
		  showPrivacy={props.showPrivacy}
		  tableHeading={props.tableHeading}
		  type={type}
		  user={props.user}
		  onTypeChange={handleTypeChange}
		/>
		<PagerElement
		  from={props.from}
		  nextEnabled={props.nextEnabled}
		  paginationUrl={paginationUrl}
		  querySearchParams={querySearchParams}
		  results={results}
		  searchParamsChangeCallback={searchParamsChangeCallback}
		  searchResultsCallback={searchResultsCallback}
		  size={props.size}
		/>
	  </div>
	);
  }

CollectionsPage.displayName = 'CollectionsPage';
CollectionsPage.propTypes = {
	editor: PropTypes.object,
	entityTypes: PropTypes.array.isRequired,
	from: PropTypes.number,
	nextEnabled: PropTypes.bool.isRequired,
	results: PropTypes.array,
	showIfOwnerOrCollaborator: PropTypes.bool,
	showLastModified: PropTypes.bool,
	showOwner: PropTypes.bool,
	showPrivacy: PropTypes.bool,
	size: PropTypes.number,
	tableHeading: PropTypes.string,
	type: PropTypes.string,
	user: PropTypes.object
};
CollectionsPage.defaultProps = {
	editor: null,
	from: 0,
	results: [],
	showIfOwnerOrCollaborator: false,
	showLastModified: false,
	showOwner: false,
	showPrivacy: false,
	size: 20,
	tableHeading: 'Collections',
	type: '',
	user: null

};

export default CollectionsPage;
