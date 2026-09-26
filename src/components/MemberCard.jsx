const getBgColor = (member) => {
  if (member.alive === false) return "#AFAFAF";
  if (member.gender === "Female") return "#FFC2E1";
  return "#C0EDFF";
};

const MemberCard = ({ member }) => {
  const bgColor = getBgColor(member);

  return (
    <div
      className="d-flex align-items-center gap-3 mt-3 p-3 rounded"
      style={{ backgroundColor: bgColor, border: "1px solid #9ec5fe" }}
    >
      {member.profileImage && (
        <img
          src={member.profileImage}
          alt={`${member.firstName} ${member.lastName}`}
          style={{ width: 56, height: 56, borderRadius: "10%", objectFit: "cover", flexShrink: 0 }}
        />
      )}
      <div>
        <div className="fw-bold">
          {member.firstName} {member.lastName}
        </div>
        <div className="text-muted small">
          ID: {member.memberId}
          {member.gender && <> &middot; {member.gender}</>}
          {member.familyId && <> &middot; Family: {member.familyId}</>}
        </div>
      </div>
    </div>
  );
};

export default MemberCard;
