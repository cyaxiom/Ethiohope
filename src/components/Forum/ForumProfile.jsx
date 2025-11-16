import React from 'react';
import {
  Edit,
  MapPin,
  Calendar,
  MessageSquare,
  Heart,
  TrendingUp,
} from 'lucide-react';
import { getProfileDetails } from '../../api/forum';

// --- Small Reusable Components --- //
function Card({ children, className = '' }) {
  return <div className={`rounded-lg shadow-sm ${className}`}>{children}</div>;
}

function Button({ children, className = '', ...props }) {
  return (
    <button
      className={`inline-flex items-center justify-center bg-orange font-medium px-4 py-2 rounded-lg hover:bg-orange/90 transition ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

function Badge({ children, className = '' }) {
  return (
    <span className={`px-2 py-1 rounded-md text-xs font-medium ${className}`}>
      {children}
    </span>
  );
}

function Avatar({ src, fallback, alt, className = '' }) {
  return (
    <div
      className={`rounded-full overflow-hidden bg-gray-200 flex items-center justify-center ${className}`}
    >
      {src ? (
        <img src={src} alt={alt} className="w-full h-full object-cover" />
      ) : (
        <span className="text-lg font-semibold">{fallback}</span>
      )}
    </div>
  );
}

// --- Main Profile Page --- //
export default function ForumProfile() {
  //profile details
  const [profileDetails, setProfileDetails] = React.useState({});
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    // Fetch profile details from API
    const fetchProfileDetails = async () => {
      setLoading(true);
      const response = await getProfileDetails(1); //TODO: dynamic user id
      if (!response.success) {
        setError(response.message || 'Failed to load profile');
        setLoading(false);
        return;
      }
      setLoading(false);
      setProfileDetails(response.data || {});
    };

    fetchProfileDetails();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-start justify-center bg-background">
        <p className="text-muted-foreground">Loading profile...</p>
      </div>
    );
  }
  if (error) {
    return (
      <div className="min-h-screen flex items-start justify-center bg-background">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Profile Header */}
        <div className="text-center mb-12">
          <Avatar
            src="https://randomuser.me/api/portraits/women/44.jpg"
            alt="Profile"
            fallback="JD"
            className="w-24 h-24 mx-auto mb-6"
          />

          <h1 className="text-3xl font-bold text-foreground mb-2">
            {profileDetails.name}
          </h1>
          <p className="text-muted-foreground text-lg mb-4">
            {profileDetails.bio}
          </p>

          <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground mb-6">
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              <span>{profileDetails.location}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>Joined {profileDetails.joinDate}</span>
            </div>
          </div>

          <Button className="hover:scale-105 transition active:scale-100 cursor-pointer">
            <Edit className="w-4 h-4 mr-2" />
            Edit Profile
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-4 mb-12">
          <Card className="p-6 text-center border border-border">
            <div className="flex items-center justify-center mb-2">
              <MessageSquare className="w-5 h-5 text-orange" />
            </div>
            <div className="text-2xl font-bold text-foreground">
              {profileDetails.answers}
            </div>
            <div className="text-sm text-muted-foreground">Answers</div>
          </Card>

          <Card className="p-6 text-center border border-border">
            <div className="flex items-center justify-center mb-2">
              <Heart className="w-5 h-5 text-orange" />
            </div>
            <div className="text-2xl font-bold text-foreground">
              {profileDetails.likes}
            </div>
            <div className="text-sm text-muted-foreground">Likes</div>
          </Card>

          <Card className="p-6 text-center border border-border">
            <div className="flex items-center justify-center mb-2">
              <TrendingUp className="w-5 h-5 text-orange" />
            </div>
            <div className="text-2xl font-bold text-foreground">
              {profileDetails.reputation}
            </div>
            <div className="text-sm text-muted-foreground">Reputation</div>
          </Card>
        </div>

        {/* About Section */}
        <Card className="p-8 mb-8 border border-border">
          <h2 className="text-xl font-semibold text-foreground mb-4">About</h2>
          <p className="text-muted-foreground leading-relaxed mb-6">
            {profileDetails.about}
          </p>

          <div className="flex flex-wrap gap-2">
            {profileDetails.skills &&
              profileDetails.skills.map((skill) => (
                <Badge key={skill}>{skill}</Badge>
              ))}
          </div>
        </Card>

        {/* Recent Activity */}
        <Card className="p-8 border border-border">
          <h2 className="text-xl font-semibold text-foreground mb-6">
            Recent Activity
          </h2>

          <div className="space-y-4">
            {profileDetails.recentActivity &&
              profileDetails.recentActivity.map((activity, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 pb-4 border-b border-border last:border-b-0"
                >
                  <div className="w-2 h-2 bg-orange rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <p className="text-foreground font-medium">
                      {activity.type}: "{activity.content}"
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {activity.timeAgo}
                    </p>
                  </div>
                </div>
              ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
