import React, { useState } from 'react';
import { HelpGroupMember, HelpGroupPage } from '@/src/api/types';
import { Button, FilterPills, SimpleLink, Text } from '@/src/components/ui';
import { TextInput } from '@/src/components/ui/Inputs';
import { Spinner } from '@/src/components/ui/Spinner';
import { openModal, useModalContext } from '@/src/features/modals/Modal';
import { ModalGeneric } from '@/src/features/modals/Modal/ModalGeneric';
import {
  MEMBERS_PAGE_SIZE,
  useGetHelpGroupMembersQuery,
} from '@/src/use-cases/help-groups';
import { HelpGroupAvatar } from '../HelpGroupAvatar';
import { HelpGroupLoadError } from '../HelpGroupLoadError';
import {
  formatAuthorName,
  formatAuthorRoleLabel,
  formatMemberSinceLabel,
  formatShownMembersLabel,
  getAuthorAvatarUser,
  getProfileHref,
  HELP_GROUP_MEMBERS_ALL_ROLES,
  HELP_GROUP_MEMBERS_LOAD_ERROR,
  HELP_GROUP_MEMBERS_MORE_LABEL,
  HELP_GROUP_MEMBERS_NO_RESULT_LABEL,
  HELP_GROUP_MEMBERS_PROFILE_LABEL,
  HELP_GROUP_MEMBERS_ROLE_FILTER_LABEL,
  HELP_GROUP_MEMBERS_ROLE_FILTERS,
  HELP_GROUP_MEMBERS_SEARCH_LABEL,
  HELP_GROUP_MEMBERS_TITLE,
  HelpGroupMembersRoleFilter,
} from '../help-groups.labels';
import { useDebouncedValue } from '../hooks/useDebouncedValue';
import {
  StyledHelpGroupMemberIdentity,
  StyledHelpGroupMemberRow,
  StyledHelpGroupMembersEmpty,
  StyledHelpGroupMembersList,
  StyledHelpGroupMembersModalFilters,
} from './HelpGroupMembers.styles';

export const MEMBERS_SEARCH_DEBOUNCE_MS = 300;

type MembersGroup = Pick<HelpGroupPage, 'slug' | 'membersCount'>;

// The pages already shown, for the current search and role filter
interface LoadedPages {
  filtersKey: string;
  page: number;
  previousMembers: HelpGroupMember[];
  previousTotal?: number;
}

function HelpGroupMemberItem({ member }: { member: HelpGroupMember }) {
  const { onClose } = useModalContext();
  const { author, hasPicture, joinedAt } = member;
  const isLinkable = !author.isDeleted && author.profileLinkable && author.id;
  const details = [
    formatAuthorRoleLabel(author),
    formatMemberSinceLabel(joinedAt),
  ]
    .filter(Boolean)
    .join(' · ');

  return (
    <StyledHelpGroupMemberRow data-testid="help-group-member">
      <HelpGroupAvatar
        user={getAuthorAvatarUser(author)}
        hasPicture={hasPicture}
        size={36}
      />
      <StyledHelpGroupMemberIdentity>
        <Text weight="semibold">{formatAuthorName(author)}</Text>
        <Text size="small" color="darkGray">
          {details}
        </Text>
      </StyledHelpGroupMemberIdentity>
      {isLinkable && (
        <SimpleLink
          href={getProfileHref(author.id as string)}
          onClick={() => onClose?.()}
        >
          {HELP_GROUP_MEMBERS_PROFILE_LABEL}
        </SimpleLink>
      )}
    </StyledHelpGroupMemberRow>
  );
}

/**
 * Full list of the members of a group, from the most recent arrival: search
 * on the first name (debounced), role filter, pages of 20 accumulated with
 * « Afficher 20 membres de plus ». A new search or filter starts over from
 * the first page.
 */
export function HelpGroupMembersModal({ slug, membersCount }: MembersGroup) {
  const [searchInput, setSearchInput] = useState('');
  const [role, setRole] = useState<HelpGroupMembersRoleFilter>(
    HELP_GROUP_MEMBERS_ALL_ROLES
  );
  const search = useDebouncedValue(
    searchInput.trim(),
    MEMBERS_SEARCH_DEBOUNCE_MS
  );
  const filtersKey = `${role}|${search}`;
  const [loadedPages, setLoadedPages] = useState<LoadedPages>({
    filtersKey,
    page: 1,
    previousMembers: [],
  });
  // Derived rather than reset in an effect: a new filter never requests a
  // later page of the previous results
  const pages: LoadedPages =
    loadedPages.filtersKey === filtersKey
      ? loadedPages
      : { filtersKey, page: 1, previousMembers: [] };

  const { currentData, isFetching, isError, refetch } =
    useGetHelpGroupMembersQuery({
      slug,
      page: pages.page,
      limit: MEMBERS_PAGE_SIZE,
      ...(search ? { search } : {}),
      ...(role !== HELP_GROUP_MEMBERS_ALL_ROLES ? { role } : {}),
    });

  const previousIds = new Set(
    pages.previousMembers.map(({ author }) => author.id)
  );
  const members = [
    ...pages.previousMembers,
    // A member who joined meanwhile shifts the pages: no duplicate row
    ...(currentData?.members ?? []).filter(
      ({ author }) => !previousIds.has(author.id)
    ),
  ];
  const total = currentData?.total ?? pages.previousTotal;
  const hasMore =
    !!currentData && !isFetching && members.length < currentData.total;

  const showMore = () =>
    setLoadedPages({
      filtersKey,
      page: pages.page + 1,
      previousMembers: members,
      previousTotal: total,
    });

  const isEmpty = !!currentData && members.length === 0;

  return (
    <ModalGeneric
      title={`${HELP_GROUP_MEMBERS_TITLE} · ${membersCount}`}
      ariaLabel={HELP_GROUP_MEMBERS_TITLE}
      align="left"
      size="small"
      footerLayout="spread"
      footer={
        <>
          <Text size="small" color="darkGray">
            {total && members.length > 0
              ? formatShownMembersLabel(members.length, total)
              : ''}
          </Text>
          {hasMore && (
            <Button
              variant="secondary"
              onClick={showMore}
              dataTestId="help-group-members-more"
            >
              {HELP_GROUP_MEMBERS_MORE_LABEL}
            </Button>
          )}
        </>
      }
    >
      <StyledHelpGroupMembersModalFilters>
        <TextInput
          id="help-group-members-search"
          name="help-group-members-search"
          title={HELP_GROUP_MEMBERS_SEARCH_LABEL}
          placeholder={HELP_GROUP_MEMBERS_SEARCH_LABEL}
          value={searchInput}
          onChange={setSearchInput}
          noMarginBottom
        />
        <FilterPills
          options={HELP_GROUP_MEMBERS_ROLE_FILTERS}
          value={role}
          onChange={setRole}
          ariaLabel={HELP_GROUP_MEMBERS_ROLE_FILTER_LABEL}
          idPrefix="help-group-members-role"
        />
      </StyledHelpGroupMembersModalFilters>
      <StyledHelpGroupMembersList data-testid="help-group-members-list">
        {members.map((member) => (
          <HelpGroupMemberItem key={member.author.id} member={member} />
        ))}
      </StyledHelpGroupMembersList>
      {isFetching && <Spinner />}
      {isEmpty && (
        <StyledHelpGroupMembersEmpty data-testid="help-group-members-empty">
          <Text color="darkGray" center>
            {HELP_GROUP_MEMBERS_NO_RESULT_LABEL}
          </Text>
        </StyledHelpGroupMembersEmpty>
      )}
      {isError && !isFetching && (
        <HelpGroupLoadError
          message={HELP_GROUP_MEMBERS_LOAD_ERROR}
          onRetry={refetch}
        />
      )}
    </ModalGeneric>
  );
}

export const openHelpGroupMembersModal = ({
  slug,
  membersCount,
}: MembersGroup) =>
  openModal(<HelpGroupMembersModal slug={slug} membersCount={membersCount} />);
