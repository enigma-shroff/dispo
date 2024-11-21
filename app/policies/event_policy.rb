class EventPolicy < ApplicationPolicy
  def upload?
    true  # All users can upload images
  end
end