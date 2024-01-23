/*
 * Copyright (C) 2016  Ben Ockmore
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 2 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.	See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License along
 * with this program; if not, write to the Free Software Foundation, Inc.,
 * 51 Franklin Street, Fifth Floor, Boston, MA 02110-1301 USA.
 */

import * as authorCreditFormatter from './authorCredit';
import * as base from './base';
import _ from 'lodash';


function formatNewAnnotation(change) {
	return base.formatChange(
		change, 'Annotation', (side) => [side && side.content]
	);
}

function formatNewDisambiguation(change) {
	return base.formatChange(
		change, 'Disambiguation', (side) => [side && side.comment]
	);
}

function formatChangedAnnotation(change) {
	return base.formatChange(change, 'Annotation', (side) => side && [side]);
}

function formatChangedDisambiguation(change) {
	return base.formatChange(
		change, 'Disambiguation', (side) => side && [side]
	);
}

function formatNewAliasSet(change) {
	const {value} = change;
	const changes = [];
	if (value.defaultAlias && value.defaultAliasId) {
		changes.push(
			base.formatRow('CREATE', 'Default Alias', null, [value.defaultAlias.name])
		);
	}

	if (value.aliases && value.aliases.length) {
		changes.push(
			base.formatRow(
				'CREATE', 'Aliases', null, value.aliases.map((alias) => alias.name)
			)
		);
	}

	return changes;
}

function formatAliasAddOrDelete(change) {
	return [
		base.formatChange(
			change.item,
			'Aliases',
			(side) => side && [`${side.name} (${side.sortName})`]
		)
	];
}

function formatAliasModified(change) {
	if (change.path.length > 3 && change.path[3] === 'name') {
		return [
			base.formatChange(
				change,
				`Alias ${change.path[2]} -> Name`,
				(side) => side && [side]
			)
		];
	}

	if (change.path.length > 3 && change.path[3] === 'sortName') {
		return [
			base.formatChange(
				change,
				`Alias ${change.path[2]} -> Sort Name`,
				(side) => side && [side]
			)
		];
	}

	const REQUIRED_DEPTH = 4;
	const aliasLanguageChanged =
		change.path.length >= REQUIRED_DEPTH && change.path[3] === 'language' &&
		change.path[4] === 'name';
	if (aliasLanguageChanged) {
		return [
			base.formatChange(
				change,
				`Alias ${change.path[2]} -> Language`,
				(side) => side && [side]
			)
		];
	}

	if (change.path.length >= 3 && change.path[3] === 'primary') {
		return [
			base.formatChange(
				change,
				`Alias ${change.path[2]} -> Primary`,
				(side) => !_.isNull(side) && [side.primary ? 'Yes' : 'No']
			)
		];
	}

	return [];
}

function formatDefaultAliasModified(change) {
	if (change.path.length > 2 && change.path[2] === 'name') {
		return [
			base.formatChange(change, 'Default Alias', (side) => side && [side])
		];
	}

	return [];
}

function formatRelationshipAttributeModified(change) {
	if (change.path.length > 7 && change.path[7] === 'textValue') {
		return [
			base.formatChange(change,
				`Relationship Attribute ${change.path[2]} -> Value`, (side) => side && [side])
		];
	}
	return [];
}

function formatAlias(change) {
	const aliasSetAdded =
		change.type === 'CREATE' && _.isEqual(change.path, ['aliasSet']);
	if (aliasSetAdded) {
		return formatNewAliasSet(change);
	}

	const aliasSetChanged =
		change.path.length > 1 && change.path[0] === 'aliasSet' &&
		change.path[1] === 'aliases';
	if (aliasSetChanged) {
		if (change.type === 'CREATE') {
			// Alias added to or deleted from set
			return formatAliasAddOrDelete(change);
		}

		if (change.type === 'CHANGE') {
			// Entry in alias set changed
			return formatAliasModified(change);
		}
	}

	const defaultAliasChanged =
		_.isEqual(change.path.slice(0, 2), ['aliasSet', 'defaultAlias']);
	if (defaultAliasChanged) {
		return formatDefaultAliasModified(change);
	}

	return null;
}

function formatNewIdentifierSet(change) {
	const {value} = change;
	if (value.identifiers && value.identifiers.length > 0) {
		return [base.formatRow(
			'CREATE', 'Identifiers', null, value.identifiers.map(
				(identifier) => `${identifier.type && identifier.type.label}: ${identifier.value}`
			)
		)];
	}

	return [];
}

function formatIdentifierAddOrDelete(change) {
	return [
		base.formatChange(
			change.item,
			`Identifier ${change.index}`,
			(side) => side && [`${side.type.label}: ${side.value}`]
		)
	];
}

function formatIdentifierModified(change) {
	if (change.path.length > 3 && change.path[3] === 'value') {
		return [
			base.formatChange(
				change,
				`Identifier ${change.path[2]} -> Value`,
				(side) => side && [side]
			)
		];
	}

	const REQUIRED_DEPTH = 4;
	if (change.path.length > REQUIRED_DEPTH && change.path[3] === 'type' &&
			change.path[4] === 'label') {
		return [
			base.formatChange(
				change,
				`Identifier ${change.path[2]} -> Type`,
				(side) => side && [side]
			)
		];
	}

	return [];
}

function formatIdentifier(change) {
	const identifierSetAdded =
		change.type === 'CREATE' && _.isEqual(change.path, ['identifierSet']);
	if (identifierSetAdded) {
		return formatNewIdentifierSet(change);
	}

	const identifierSetChanged =
		change.path.length > 1 && change.path[0] === 'identifierSet' &&
		change.path[1] === 'identifiers';
	if (identifierSetChanged) {
		if (change.type === 'CREATE') {
			// Identifier added to or deleted from set
			return formatIdentifierAddOrDelete(change);
		}

		if (change.type === 'CHANGE') {
			// Entry in identifier set changed
			return formatIdentifierModified(change);
		}
	}

	return null;
}

function formatRelationshipAttributeAddOrDelete(relationshipAttributes) {
	const attributes = [];
	if (relationshipAttributes.length) {
		relationshipAttributes.forEach((attribute) => {
			attributes.push(`${attribute.type.name}: ${attribute.value.textValue}`);
		});
	}
	return attributes;
}

function formatRelationshipAdd(entity, change) {
	const changes = [];
	const {value} = change.item;

	if (!value) {
		return changes;
	}
	const key = value.type && value.type.label ? `Relationship : ${value.type.label}` : 'Relationship';
	let attributes = [];
	if (value.attributeSetId) {
		attributes = formatRelationshipAttributeAddOrDelete(value.attributeSet?.relationshipAttributes);
	}
	if (value.sourceBbid === entity.get('bbid')) {
		changes.push(
			base.formatRow(
				'CREATE', key, null, [value.targetBbid, ...attributes]
			)
		);
	}
	else {
		changes.push(
			base.formatRow(
				'CREATE', key, null, [value.sourceBbid, ...attributes]
			)
		);
	}
	return changes;
}

function formatAddOrDeleteRelationshipSet(entity, change) {
	const changes = [];
	let allRelationships;
	if (change.type === 'CREATE') {
		allRelationships = change.value.relationships;
	}
	if (change.type === 'DELETE') {
		allRelationships = change.oldValue.relationships;
	}
	if (!allRelationships) {
		return changes;
	}

	allRelationships.forEach((relationship) => {
		const key = relationship.type && relationship.type.label ? `Relationship: ${relationship.type.label}` : 'Relationship';
		let attributes = [];
		if (relationship.attributeSetId) {
			attributes = formatRelationshipAttributeAddOrDelete(relationship.attributeSet?.relationshipAttributes);
		}
		if (relationship.sourceBbid === entity.get('bbid')) {
			changes.push(
				base.formatRow(
					change.type, key, [relationship.targetBbid, ...attributes], [relationship.targetBbid, ...attributes]
				)
			);
		}
		else {
			changes.push(
				base.formatRow(
					change.type, key, [relationship.sourceBbid, ...attributes], [relationship.sourceBbid, ...attributes]
				)
			);
		}
	});
	return changes;
}

function formatRelationshipRemove(entity, change) {
	const changes = [];
	const {oldValue} = change.item;

	if (!oldValue) {
		return changes;
	}
	const key = oldValue.type && oldValue.type.label ? `Relationship : ${oldValue.type.label}` : 'Relationship';
	let attributes = [];
	if (oldValue.attributeSetId) {
		attributes = formatRelationshipAttributeAddOrDelete(oldValue.attributeSet?.relationshipAttributes);
	}
	if (oldValue.sourceBbid === entity.get('bbid')) {
		changes.push(
			base.formatRow(
				'DELETE', key, [oldValue.targetBbid, ...attributes], null
			)
		);
	}
	else {
		changes.push(
			base.formatRow(
				'DELETE', key, [oldValue.sourceBbid, ...attributes], null
			)
		);
	}
	return changes;
}
function formatRelationship(entity, change) {
	if (change.type === 'CREATE') {
		return formatAddOrDeleteRelationshipSet(entity, change);
	}
	if (change.type === 'CREATE') {
		if (change.item.type === 'CREATE') {
			return formatRelationshipAdd(entity, change);
		}
		if (change.item.type === 'DELETE') {
			return formatRelationshipRemove(entity, change);
		}
	}
	if (change.type === 'CHANGE') {
		return formatRelationshipAttributeModified(change);
	}
	if (change.type === 'DELETE') {
		return formatAddOrDeleteRelationshipSet(entity, change);
	}
	return null;
}

function formatEntityChange(entity, change) {
	const aliasChanged =
		_.isEqual(change.path, ['aliasSet']) ||
		_.isEqual(change.path.slice(0, 2), ['aliasSet', 'aliases']) ||
		_.isEqual(change.path.slice(0, 2), ['aliasSet', 'defaultAlias']);
	if (aliasChanged) {
		return formatAlias(change);
	}

	const identifierChanged =
		_.isEqual(change.path, ['identifierSet']) ||
		_.isEqual(change.path.slice(0, 2), ['identifierSet', 'identifiers']);
	if (identifierChanged) {
		return formatIdentifier(change);
	}

	const relationshipChanged =
		_.isEqual(change.path, ['relationshipSet']) ||
		_.isEqual(change.path.slice(0, 2), ['relationshipSet', 'relationships']);
	if (relationshipChanged) {
		return formatRelationship(entity, change);
	}

	if (_.isEqual(change.path, ['annotation'])) {
		return formatNewAnnotation(change);
	}

	if (_.isEqual(change.path, ['annotation', 'content'])) {
		return formatChangedAnnotation(change);
	}

	if (_.isEqual(change.path, ['disambiguation'])) {
		return formatNewDisambiguation(change);
	}

	if (_.isEqual(change.path, ['disambiguation', 'comment'])) {
		return formatChangedDisambiguation(change);
	}

	if (authorCreditFormatter.changed(change)) {
		return authorCreditFormatter.format(change);
	}

	return null;
}

export function formatEntityDiffs(diffs, entityType, entityFormatter) {
	if (!diffs) {
		return [];
	}

	return _.flatten(diffs).map((diff) => {
		const formattedDiff = {
			entity: diff.entity.toJSON(),
			isDeletion: diff.isDeletion,
			isNew: diff.isNew
		};

		formattedDiff.entity.type = entityType;
		formattedDiff.entityRevision = diff.revision && diff.revision.toJSON();

		if (diff.entityAlias) {
			// In the revision route, we fetch an entity's data to show its alias; an ORM model is returned.
			// For entities without data (deleted or merged), we use getEntityParentAlias instead which returns a JSON object
			if (typeof diff.entityAlias.toJSON === 'function') {
				const aliasJSON = diff.entityAlias.toJSON();
				if (diff.isEntityDeleted) {
					formattedDiff.entity.parentAlias = aliasJSON.aliasSet.defaultAlias;
				}
				else {
					formattedDiff.entity.defaultAlias = aliasJSON.aliasSet.defaultAlias;
				}
			}
			else if (diff.isEntityDeleted) {
				formattedDiff.entity.parentAlias = diff.entityAlias;
			}
			else {
				formattedDiff.entity.defaultAlias = diff.entityAlias;
			}
		}

		if (!diff.changes) {
			formattedDiff.changes = [];

			return formattedDiff;
		}

		const rawChangeSets = diff.changes.map(
			(change) =>
				formatEntityChange(diff.entity, change) || (
					entityFormatter && entityFormatter(change)
				)
		);

		formattedDiff.changes = _.sortBy(
			_.flatten(_.compact(rawChangeSets)),
			'key'
		);

		return formattedDiff;
	});
}
