import HeaderBackoffice from './HeaderBackoffice';

const HeaderBackoffice = ({
  title,
  description,
  children,
  childrenBottom,
  page,
  noSeparator,
}) => {
  const { user } = useContext(UserContext);
  const router = useRouter();
  const badges = useNotifBadges(user, router.asPath);

  return (
    <StyledHeaderBackOffice>
      <Grid
        gap="small"
        column={childrenBottom}
        eachWidths={['expand@m', 'auto@m']}
      >
        <div>
          <h2 className="uk-text-bold">{title}</h2>
          <p className="uk-text-lead">{description}</p>
        </div>
        <div>{children}</div>
      </Grid>
      {page === 'candidates' ? (
        <div className="notif-container">
          <p>
            <div className="uk-badge uk-margin-small-left">
              {badges.members}
            </div>
            CV en attente de validation
          </p>
        </div>
      ) : (
        !noSeparator && <div className="simple-separator" />
      )}
    </StyledHeaderBackOffice>
  );
};
HeaderBackoffice.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  children: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.arrayOf(PropTypes.element),
  ]),
  childrenBottom: PropTypes.bool,
  page: PropTypes.oneOf(['', ...BACKOFFICE_PAGES]),
  noSeparator: PropTypes.bool,
};
HeaderBackoffice.defaultProps = {
  children: undefined,
  childrenBottom: false,
  page: '',
  noSeparator: false,
};
export default HeaderBackoffice;
